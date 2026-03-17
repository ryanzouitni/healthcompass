import pg from "pg";

const { Pool } = pg;

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL missing");
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  const client = await pool.connect();

  try {
    console.log("Running migration...");

    await client.query(`CREATE EXTENSION IF NOT EXISTS vector;`);

    await client.query(`
      CREATE TABLE IF NOT EXISTS rag_sources (
        id TEXT PRIMARY KEY,
        corpus_id TEXT NOT NULL,
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        publisher TEXT,
        country TEXT,
        language TEXT,
        last_fetched_at TIMESTAMP,
        hash TEXT
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS rag_chunks (
        id TEXT PRIMARY KEY,
        corpus_id TEXT NOT NULL,
        source_id TEXT NOT NULL REFERENCES rag_sources(id),
        chunk_index INT NOT NULL,
        chunk_text TEXT NOT NULL,
        embedding vector(1536) NOT NULL,
        tags TEXT[],
        created_at TIMESTAMP DEFAULT now()
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS rag_chunks_embedding_idx
      ON rag_chunks USING ivfflat (embedding vector_cosine_ops)
      WITH (lists = 100);
    `);

    console.log("Migration complete.");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});