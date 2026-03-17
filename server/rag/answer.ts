// server/rag/answer.ts
import OpenAI from "openai";
import type { RagHit } from "./retrieve";
import { retrieveTopK } from "./retrieve";

export type RagCitation = {
  sourceId: string;
  title: string | null;
  url: string | null;
  publisher: string | null;
  language: string | null;
  usedChunkIds: string[];
};

export type RagAnswerResult = {
  success: true;
  question: string;
  topK: number;
  answer: string;
  citations: RagCitation[];
  hits: RagHit[];
};

function requireOpenAI(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY missing (add it in Replit Secrets)");
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function buildCitations(hits: RagHit[]): RagCitation[] {
  const bySource = new Map<string, RagCitation>();

  for (const h of hits) {
    const key = h.sourceId;
    const existing = bySource.get(key);
    if (!existing) {
      bySource.set(key, {
        sourceId: h.sourceId,
        title: h.title ?? null,
        url: h.url ?? null,
        publisher: h.publisher ?? null,
        language: h.language ?? null,
        usedChunkIds: [h.chunkId],
      });
    } else {
      if (!existing.usedChunkIds.includes(h.chunkId)) existing.usedChunkIds.push(h.chunkId);
    }
  }

  return Array.from(bySource.values());
}

function formatContext(hits: RagHit[]): string {
  // Keep context bounded so token usage doesn’t explode
  const maxCharsPerChunk = 1600;

  return hits
    .map((h, idx) => {
      const title = h.title ?? "Untitled source";
      const url = h.url ?? "no-url";
      const pub = h.publisher ?? "unknown publisher";
      const content =
        h.content.length > maxCharsPerChunk ? h.content.slice(0, maxCharsPerChunk) + "…" : h.content;

      // We label each chunk with a citation marker like [S1], [S2] etc.
      return `SOURCE [S${idx + 1}]
Title: ${title}
Publisher: ${pub}
URL: ${url}
ChunkId: ${h.chunkId}
ChunkIndex: ${h.chunkIndex}
Content:
${content}
`;
    })
    .join("\n---\n");
}

function buildSystemPrompt(): string {
  return `
You are a clinical information assistant. You must answer ONLY using the provided SOURCES.
If the SOURCES do not contain enough information, say so clearly and ask a follow-up question.

Rules:
- Do not invent facts.
- Do not cite anything outside the SOURCES.
- When you make a claim, add citations like [S1], [S2] next to the sentence.
- Prefer concise, structured output.
- Include safety: encourage seeing a clinician for urgent symptoms or individualized medical advice.
`.trim();
}

export async function ragAnswer(question: string, topK: number): Promise<RagAnswerResult> {
  const q = question.trim();
  if (!q) throw new Error("Question is empty");

  let k = Number.isFinite(topK) ? topK : 5;
  if (k <= 0) k = 5;
  if (k > 10) k = 10;

  const hits = await retrieveTopK(q, k);

  if (!hits.length) {
    return {
      success: true,
      question: q,
      topK: k,
      answer:
        "I couldn’t find relevant information in the current knowledge base. Try rephrasing your question or ingest more sources.",
      citations: [],
      hits: [],
    };
  }

  const client = requireOpenAI();

  const context = formatContext(hits);

  const userPrompt = `
Question:
${q}

SOURCES:
${context}

Task:
Write a helpful answer to the question using ONLY the SOURCES.
Add citations like [S1], [S2] wherever you use information.
If SOURCES disagree, mention that and cite both.
Output format:

Answer:
- (bullet points or short paragraphs)

Citations:
- S1: title — url
- S2: title — url
`.trim();

  // Use a strong general model for synthesis
  const resp = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    messages: [
      { role: "system", content: buildSystemPrompt() },
      { role: "user", content: userPrompt },
    ],
  });

  const answer = resp.choices?.[0]?.message?.content?.trim() || "No answer generated.";

  const citations = buildCitations(hits);

  return {
    success: true,
    question: q,
    topK: k,
    answer,
    citations,
    hits,
  };
}