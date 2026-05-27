/**
 * Ingest playbook markdown files into the PlaybookChunk table.
 *
 * One chunk per `##` heading. Idempotent — re-running replaces existing
 * chunks keyed by (context, title).
 *
 * Usage:
 *   VOYAGE_API_KEY=... npm run ingest:playbooks
 */

import { PrismaClient, Prisma } from '@prisma/client';
import { readFile, readdir } from 'node:fs/promises';
import { join, basename, extname } from 'node:path';
import { embedBatch } from '../src/services/embedding.service';

const PLAYBOOKS_DIR = join(__dirname, '..', 'playbooks');

interface RawChunk {
  context: string;
  title: string;
  content: string;
}

/**
 * Parse a markdown file into chunks. One chunk per `##` heading.
 * Anything before the first `##` (the `# Document Title`) is ignored.
 */
function parseMarkdown(filename: string, raw: string): RawChunk[] {
  const context = basename(filename, extname(filename));
  const lines = raw.split('\n');

  const chunks: RawChunk[] = [];
  let currentTitle: string | null = null;
  let currentBody: string[] = [];

  const push = () => {
    if (currentTitle && currentBody.length > 0) {
      const content = currentBody.join('\n').trim();
      if (content.length > 0) {
        chunks.push({ context, title: currentTitle, content });
      }
    }
  };

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)$/);
    if (h2) {
      push();
      currentTitle = h2[1].trim();
      currentBody = [];
    } else if (currentTitle) {
      currentBody.push(line);
    }
  }
  push();

  return chunks;
}

function cuid(): string {
  return 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

async function main() {
  const apiKey = process.env.VOYAGE_API_KEY || '';
  if (!apiKey) {
    console.warn('[ingest] VOYAGE_API_KEY not set — using mock embeddings. NOT FOR PRODUCTION.');
  }

  const prisma = new PrismaClient();

  const files = (await readdir(PLAYBOOKS_DIR)).filter((f) => f.endsWith('.md'));
  console.log(`[ingest] Found ${files.length} playbook files: ${files.join(', ')}`);

  const allChunks: RawChunk[] = [];
  for (const f of files) {
    const raw = await readFile(join(PLAYBOOKS_DIR, f), 'utf-8');
    const chunks = parseMarkdown(f, raw);
    console.log(`[ingest]   ${f}: ${chunks.length} chunks`);
    allChunks.push(...chunks);
  }

  if (allChunks.length === 0) {
    console.error('[ingest] No chunks found. Aborting.');
    process.exit(1);
  }

  console.log(`[ingest] Embedding ${allChunks.length} chunks via Voyage…`);
  const BATCH = 64;
  const embeddings: number[][] = [];
  for (let i = 0; i < allChunks.length; i += BATCH) {
    const slice = allChunks.slice(i, i + BATCH);
    const vecs = await embedBatch(
      slice.map((c) => `${c.title}\n\n${c.content}`),
      apiKey,
    );
    embeddings.push(...vecs);
    console.log(`[ingest]   embedded ${Math.min(i + BATCH, allChunks.length)}/${allChunks.length}`);
  }

  console.log('[ingest] Upserting into PlaybookChunk…');
  for (let i = 0; i < allChunks.length; i++) {
    const c = allChunks[i];
    const e = embeddings[i];

    // Delete any prior row with the same (context, title), then insert fresh.
    // Cleaner than ON CONFLICT when one column is Unsupported(vector).
    await prisma.playbookChunk.deleteMany({
      where: { context: c.context, title: c.title },
    });

    const vectorLiteral = `[${e.join(',')}]`;
    await prisma.$executeRawUnsafe(
      `
      INSERT INTO "PlaybookChunk" ("id", "context", "title", "content", "embedding", "metadata", "createdAt")
      VALUES ($1, $2, $3, $4, $5::vector, NULL, NOW())
      `,
      cuid(),
      c.context,
      c.title,
      c.content,
      vectorLiteral,
    );
  }

  console.log(`[ingest] Done — ${allChunks.length} chunks stored.`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
