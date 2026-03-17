import pg from "pg";

const { Pool } = pg;

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  const client = await pool.connect();
  try {
    const sources = await client.query(`select count(*)::int as n from rag_sources`);
    const chunks = await client.query(`select count(*)::int as n from rag_chunks`);
    console.log("rag_sources:", sources.rows[0].n);
    console.log("rag_chunks:", chunks.rows[0].n);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});