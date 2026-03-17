import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import OpenAI from "openai";
import { getPool } from "./db.js";

type Source = {
  id: string;
  title: string;
  file: string;
  publisher?: string;
  country?: string;
  language?: string;
  tags?: string[];
};

const CORPUS_ID = process.env.RAG_CORPUS_ID ?? "MA_RURAL";
const CHUNK_SIZE = 1200;
const CHUNK_OVERLAP = 200;
const EMBEDDING_MODEL = "text-embedding-3-small";

/**
 * Extract text from a PDF using pdfjs-dist (PDF.js).
 * Reliable in Node and avoids pdf-parse export issues.
 */
async function extractPdfText(pdfBuffer: Buffer): Promise<string> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");

  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(pdfBuffer),
    disableWorker: true,
  });

  const pdf = await loadingTask.promise;
  let fullText = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();

    const strings = (content.items as any[])
      .map((it) => (typeof it?.str === "string" ? it.str : ""))
      .filter(Boolean);

    fullText += strings.join(" ") + "\n\n";
  }

  return fullText;
}

function sha256(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

function normalizeText(text: string) {
  return text
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function chunkText(text: string) {
  const clean = normalizeText(text);
  const chunks: string[] = [];

  let cursor = 0;
  while (cursor < clean.length) {
    const start = Math.max(
      0,
      cursor - (chunks.length === 0 ? 0 : CHUNK_OVERLAP)
    );
    const end = Math.min(clean.length, start + CHUNK_SIZE);
    const chunk = clean.slice(start, end).trim();
    if (chunk.length > 0) chunks.push(chunk);
    cursor = end;
  }

  return chunks;
}

function loadLocalPdfBuffer(filePath: string) {
  const abs = path.join(process.cwd(), filePath);
  if (!fs.existsSync(abs)) {
    throw new Error(`Local PDF not found: ${abs}`);
  }
  return fs.readFileSync(abs);
}

async function main() {
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY missing");

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const sourcesPath = path.join(
    process.cwd(),
    "server",
    "rag",
    "data",
    "sources.ma.json"
  );
  const sources: Source[] = JSON.parse(fs.readFileSync(sourcesPath, "utf-8"));

  if (!Array.isArray(sources) || sources.length === 0) {
    throw new Error("sources.ma.json is empty or invalid");
  }

  const pool = getPool();
  const client = await pool.connect();

  try {
    console.log(
      `Ingesting ${sources.length} local PDFs into corpus ${CORPUS_ID}...`
    );

    for (const src of sources) {
      console.log(`\n→ Loading local PDF: ${src.title}`);
      console.log(`  File: ${src.file}`);

      const pdfBuf = loadLocalPdfBuffer(src.file);

      console.log("  Extracting text (pdfjs-dist)...");
      const rawText = await extractPdfText(pdfBuf);
      const text = rawText ?? "";

      if (!text || text.length < 500) {
        console.warn(
          `  ⚠️ Very little text extracted for ${src.id}. Skipping.`
        );
        continue;
      }

      const docHash = sha256(text);
      const now = new Date();

      // Upsert rag_sources (store file path as file:...)
      await client.query(
        `
        INSERT INTO rag_sources (id, corpus_id, title, url, publisher, country, language, last_fetched_at, hash)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        ON CONFLICT (id)
        DO UPDATE SET
          corpus_id = EXCLUDED.corpus_id,
          title = EXCLUDED.title,
          url = EXCLUDED.url,
          publisher = EXCLUDED.publisher,
          country = EXCLUDED.country,
          language = EXCLUDED.language,
          last_fetched_at = EXCLUDED.last_fetched_at,
          hash = EXCLUDED.hash
        `,
        [
          src.id,
          CORPUS_ID,
          src.title,
          `file:${src.file}`,
          src.publisher ?? null,
          src.country ?? null,
          src.language ?? null,
          now,
          docHash,
        ]
      );

      // Delete old chunks for this source before inserting new ones
      await client.query(
        `DELETE FROM rag_chunks WHERE corpus_id=$1 AND source_id=$2`,
        [CORPUS_ID, src.id]
      );

      console.log("  Chunking...");
      const chunks = chunkText(text);
      console.log(`  ${chunks.length} chunks. Embedding + inserting...`);

      const BATCH = 32;

      for (let i = 0; i < chunks.length; i += BATCH) {
        const batch = chunks.slice(i, i + BATCH);

        const emb = await openai.embeddings.create({
          model: EMBEDDING_MODEL,
          input: batch,
        });

        for (let j = 0; j < batch.length; j++) {
          const chunkIndex = i + j;
          const chunkId = `${src.id}::${chunkIndex}`;

          // ✅ pgvector requires bracket format: [0.1,0.2,...]
          const embeddingArray = emb.data[j].embedding;
          const embeddingVector = `[${embeddingArray.join(",")}]`;

          await client.query(
            `
            INSERT INTO rag_chunks (id, corpus_id, source_id, chunk_index, chunk_text, embedding, tags)
            VALUES ($1,$2,$3,$4,$5,$6::vector,$7)
            `,
            [
              chunkId,
              CORPUS_ID,
              src.id,
              chunkIndex,
              batch[j],
              embeddingVector,
              src.tags ?? null,
            ]
          );
        }

        console.log(
          `    Inserted ${Math.min(i + BATCH, chunks.length)}/${chunks.length}`
        );
      }

      console.log(`  ✅ Done: ${src.id}`);
    }

    console.log("\n✅ Local ingestion complete.");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error("Ingestion failed:", err);
  process.exit(1);
});