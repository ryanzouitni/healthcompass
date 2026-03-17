// server/rag/retrieve.ts
import OpenAI from "openai";
import { pool } from "./db";

export type RagHit = {
  chunkId: string;
  corpusId: string;
  sourceId: string;
  chunkIndex: number;
  content: string;
  distance: number;
  title: string | null;
  url: string | null;
  publisher: string | null;
  language: string | null;
};

function vectorToPgString(v: number[]): string {
  return `[${v.join(",")}]`;
}

async function detectChunkTextColumn(): Promise<string> {
  const candidates = ["content", "text", "chunk_text", "chunk", "body"];

  const { rows } = await pool.query(
    `
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rag_chunks'
    `
  );

  const existing = new Set(rows.map((r: any) => String(r.column_name)));

  for (const c of candidates) {
    if (existing.has(c)) return c;
  }

  throw new Error(
    `Could not find a text column in rag_chunks. Found columns: ${[...existing].join(", ")}`
  );
}

async function pickDefaultCorpusId(): Promise<string> {
  const { rows } = await pool.query(
    `SELECT DISTINCT corpus_id FROM rag_chunks ORDER BY corpus_id LIMIT 1;`
  );
  const corpusId = rows?.[0]?.corpus_id;
  if (!corpusId) {
    throw new Error("No corpus_id found in rag_chunks (is ingestion complete?)");
  }
  return String(corpusId);
}

async function embedQuery(text: string): Promise<number[]> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY missing (add it in Replit Secrets)");
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const resp = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  const emb = resp.data?.[0]?.embedding;
  if (!emb || !Array.isArray(emb)) {
    throw new Error("Embedding API returned no embedding");
  }
  return emb;
}

/**
 * Supports BOTH usages:
 * 1) retrieveTopK("question", 5)
 * 2) retrieveTopK({ query, corpusId, k })
 */
export async function retrieveTopK(
  queryOrOpts:
    | string
    | {
        query: string;
        corpusId?: string;
        k?: number;
      },
  kMaybe?: number
): Promise<RagHit[]> {
  let query = "";
  let k = 5;
  let corpusId: string | undefined;

  if (typeof queryOrOpts === "string") {
    query = queryOrOpts.trim();
    k = typeof kMaybe === "number" && Number.isFinite(kMaybe) ? kMaybe : 5;
  } else {
    query = String(queryOrOpts.query ?? "").trim();
    k =
      typeof queryOrOpts.k === "number" && Number.isFinite(queryOrOpts.k)
        ? queryOrOpts.k
        : 5;
    corpusId = queryOrOpts.corpusId ? String(queryOrOpts.corpusId) : undefined;
  }

  if (!query) throw new Error("retrieveTopK: query is empty");

  if (!Number.isFinite(k) || k <= 0) k = 5;
  if (k > 10) k = 10;

  if (!corpusId) {
    corpusId = await pickDefaultCorpusId();
  }

  const embedding = await embedQuery(query);
  const vec = vectorToPgString(embedding);
  const textCol = await detectChunkTextColumn();

  const sql = `
    SELECT
      c.id as "chunkId",
      c.corpus_id as "corpusId",
      c.source_id as "sourceId",
      c.chunk_index as "chunkIndex",
      c.${textCol} as "content",
      (c.embedding <-> $1::vector) as "distance",
      s.title as "title",
      s.url as "url",
      s.publisher as "publisher",
      s.language as "language"
    FROM rag_chunks c
    LEFT JOIN rag_sources s ON s.id = c.source_id
    WHERE c.corpus_id = $2
    ORDER BY c.embedding <-> $1::vector
    LIMIT $3;
  `;

  const { rows } = await pool.query(sql, [vec, corpusId, k]);

  // Normalize some fields (avoid undefined surprises)
  return (rows as any[]).map((r) => ({
    chunkId: String(r.chunkId),
    corpusId: String(r.corpusId),
    sourceId: String(r.sourceId),
    chunkIndex: Number(r.chunkIndex),
    content: String(r.content ?? ""),
    distance: Number(r.distance ?? 0),
    title: r.title ?? null,
    url: r.url ?? null,
    publisher: r.publisher ?? null,
    language: r.language ?? null,
  })) as RagHit[];
}