import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

function normalize(v: number[]) {
  const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
  // Avoid division by zero
  if (norm === 0) return v;
  return v.map(x => x / norm);
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  const dot = a.reduce((sum, val, i) => sum + val * (b[i] ?? 0), 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return normA && normB ? dot / (normA * normB) : 0;
}

export async function embedFAQText(text: string) {
  const res = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
    config: {
      outputDimensionality: 768,
    },
  });
  // @google/genai returns embeddings array, take first one
  const embedding = res.embeddings?.[0]?.values || [];
  return normalize(embedding);
}

export async function embedQueryText(text: string) {
  const res = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
    config: {
      outputDimensionality: 768,
    },
  });
  // @google/genai returns embeddings array, take first one
  const embedding = res.embeddings?.[0]?.values || [];
  return normalize(embedding);
}

interface FAQItemWithEmbedding {
  embedding: number[];
  [key: string]: any; // Allow other properties
}

interface BestMatch extends FAQItemWithEmbedding {
  score: number;
}

export function getBestMatch(queryVec: number[], faqs: FAQItemWithEmbedding[]) {
  let best: BestMatch | null = null;
  for (const f of faqs) {
    if (!Array.isArray(f.embedding)) continue;
    const score = cosineSimilarity(queryVec, f.embedding);
    if (!best || score > best.score) best = { ...f, score };
  }
  return best;
}
