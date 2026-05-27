-- Add pgvector + the PlaybookChunk RAG knowledge base, plus goal-context fields on Session.

-- Enable pgvector. Idempotent.
CREATE EXTENSION IF NOT EXISTS "vector";

-- Goal-context fields on Session for retrieval.
ALTER TABLE "Session" ADD COLUMN "goalContext" TEXT;
ALTER TABLE "Session" ADD COLUMN "goalDetail" TEXT;

-- Playbook chunks table.
CREATE TABLE "PlaybookChunk" (
    "id" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" vector(1024),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PlaybookChunk_pkey" PRIMARY KEY ("id")
);

-- Metadata filter index — used when the user provides goalContext.
CREATE INDEX "PlaybookChunk_context_idx" ON "PlaybookChunk"("context");

-- IVFFlat ANN index for cosine similarity. 100 lists is fine up to ~10k rows.
-- Switch to HNSW above ~50k: CREATE INDEX ... USING hnsw (embedding vector_cosine_ops);
CREATE INDEX "PlaybookChunk_embedding_idx"
  ON "PlaybookChunk"
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
