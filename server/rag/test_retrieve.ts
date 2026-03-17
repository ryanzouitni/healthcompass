// server/rag/test_retrieve.ts
import { retrieveTopK } from "./retrieve";

const corpusId = process.env.RAG_CORPUS_ID;
if (!corpusId) {
  throw new Error("RAG_CORPUS_ID missing (add it in Replit Secrets)");
}

const question = process.argv.slice(2).join(" ").trim();
if (!question) {
  console.log(`Usage:
node --import tsx server/rag/test_retrieve.ts "What lifestyle changes help type 2 diabetes?"`);
  process.exit(1);
}

const hits = await retrieveTopK({ query: question, corpusId, k: 5 });

console.log(`\nTop hits for: "${question}"\n`);
hits.forEach((h, i) => {
  console.log(`--- HIT ${i + 1} (distance=${h.distance.toFixed(4)}) ---`);
  console.log(`title: ${h.title ?? "(no title)"}`);
  console.log(`url:   ${h.url ?? "(no url)"}`);
  console.log(`text:  ${h.content.slice(0, 400)}${h.content.length > 400 ? "..." : ""}\n`);
});