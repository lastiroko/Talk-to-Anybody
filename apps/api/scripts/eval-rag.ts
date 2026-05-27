/**
 * RAG eval — blind side-by-side of coaching with vs. without playbook retrieval.
 *
 * Runs each fixture case twice, writes a markdown side-by-side to eval-results.md.
 * Open the file and rate which arm produced more context-appropriate coaching.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=... VOYAGE_API_KEY=... npm run eval:rag
 */

import { PrismaClient } from '@prisma/client';
import { writeFile } from 'node:fs/promises';
import { generateCoaching } from '../src/services/coaching.service';
import { retrievePlaybook } from '../src/services/retrieval.service';

interface EvalCase {
  name: string;
  goalContext: string;
  goalDetail: string;
  mode: string;
  transcript: string;
  metrics: {
    wpm: number;
    fillerPerMin: number;
    avgPauseSec: number;
    pitchRangeHz: number;
    vocalVariety: number;
    totalFillers: number;
  };
}

const CASES: EvalCase[] = [
  {
    name: 'wedding_best_man',
    goalContext: 'wedding_speech',
    goalDetail: 'best man speech for my brother, 5 minutes, semi-formal crowd',
    mode: 'freestyle',
    transcript:
      "So um yeah, I've known Tom for like 28 years and basically he's my brother and um I just want to say a few words. He's always been there for me and you know he's the kind of guy who um always shows up. Sara, you're amazing too. So uh let's raise a glass. To Tom and Sara.",
    metrics: { wpm: 175, fillerPerMin: 6.5, avgPauseSec: 0.3, pitchRangeHz: 85, vocalVariety: 45, totalFillers: 12 },
  },
  {
    name: 'manager_1on1_update',
    goalContext: 'manager_1on1',
    goalDetail: '1:1 with my manager, want to update on a slipping deadline',
    mode: 'roleplay',
    transcript:
      "Hi, so I wanted to give you an update on the migration project. There's been some unexpected complexity around the legacy API endpoints, which has put us about a week behind schedule. I've identified the three biggest risks and I have a mitigation plan — happy to walk through it. I think we can still hit end-of-month if I get help from one extra engineer for two days.",
    metrics: { wpm: 138, fillerPerMin: 0.8, avgPauseSec: 0.6, pitchRangeHz: 110, vocalVariety: 68, totalFillers: 1 },
  },
  {
    name: 'pitch_seed_round',
    goalContext: 'pitch_deck',
    goalDetail: '3-minute investor pitch, seed round, B2B SaaS',
    mode: 'script',
    transcript:
      "We're building Helfa, the AI assistant that turns Germany's bureaucracy into a tracked to-do list. Every newcomer to Germany loses about 40 hours and 1,200 euros navigating residence permits and address registration — and most still get something wrong. We've shipped a first product in Köln and have 800 weekly active users two months in, with a 22% week-on-week retention. We're raising 500K to expand to Munich and Berlin and ship the residence-permit flow.",
    metrics: { wpm: 158, fillerPerMin: 0.4, avgPauseSec: 0.4, pitchRangeHz: 130, vocalVariety: 75, totalFillers: 0 },
  },
];

async function main() {
  const prisma = new PrismaClient();
  const anthropicKey = process.env.ANTHROPIC_API_KEY || '';
  const voyageKey = process.env.VOYAGE_API_KEY || '';

  if (!anthropicKey) {
    console.error('Need ANTHROPIC_API_KEY to run eval.');
    process.exit(1);
  }

  const results: string[] = [];

  for (const c of CASES) {
    console.log(`[eval] ${c.name}…`);

    const chunks = await retrievePlaybook({
      prisma,
      goalContext: c.goalContext,
      goalDetail: c.goalDetail,
      transcript: c.transcript,
      voyageApiKey: voyageKey,
      k: 4,
    });

    const withRag = await generateCoaching(c.transcript, c.metrics, c.mode, anthropicKey, chunks);
    const noRag = await generateCoaching(c.transcript, c.metrics, c.mode, anthropicKey, []);

    results.push(`
## ${c.name}

**Goal context:** ${c.goalContext}
**Goal detail:** ${c.goalDetail}
**Transcript:** ${c.transcript}

**Retrieved chunks (top ${chunks.length}):**
${chunks.map((ch, i) => `  ${i + 1}. ${ch.context}/${ch.title}  (sim ${ch.similarity.toFixed(3)})`).join('\n')}

### Without RAG
- coachingText: ${noRag.coachingText}
- fixes: ${noRag.fixes.map((f) => f.title).join('; ')}
- wins: ${noRag.wins.join('; ')}

### With RAG
- coachingText: ${withRag.coachingText}
- fixes: ${withRag.fixes.map((f) => f.title).join('; ')}
- wins: ${withRag.wins.join('; ')}
- groundedIn: ${(withRag.groundedIn ?? []).join('; ')}
`);
  }

  const out = `# RAG eval — ${new Date().toISOString()}\n${results.join('\n---\n')}`;
  await writeFile('eval-results.md', out, 'utf-8');
  console.log('[eval] Wrote eval-results.md');

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
