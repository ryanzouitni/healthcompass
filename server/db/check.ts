import pg from "pg";
const { Pool } = pg;

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  const { rows: ext } = await pool.query(
    "SELECT extname FROM pg_extension WHERE extname='vector'"
  );
  console.log("pgvector installed:", ext.length === 1);

  const { rows: tables } = await pool.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema='public'
      AND table_name IN ('rag_sources','rag_chunks')
    ORDER BY table_name;
  `);

  console.log("tables:", tables.map((t) => t.table_name));

  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});