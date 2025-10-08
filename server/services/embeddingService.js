import { pipeline } from "@xenova/transformers";

let embedder = null;

// Initialize embedder (lazy loading)
async function getEmbedder() {
  if (!embedder) {
    console.log("📦 Loading embedding model...");
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    console.log("✅ Embedding model loaded");
  }
  return embedder;
}

// Create embedding for text
export async function createEmbedding(text) {
  try {
    const embedderModel = await getEmbedder();
    const output = await embedderModel(text, {
      pooling: "mean",
      normalize: true,
    });
    return Array.from(output.data);
  } catch (error) {
    console.error("Embedding error:", error);
    throw error;
  }
}

// Calculate cosine similarity
export function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Chunk text into smaller pieces
export function chunkText(text, chunkSize = 500, overlap = 50) {
  const chunks = [];
  const words = text.split(/\s+/);

  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunk = words.slice(i, i + chunkSize).join(" ");
    if (chunk.trim().length > 0) {
      chunks.push({
        text: chunk,
        startIndex: i,
        endIndex: Math.min(i + chunkSize, words.length),
      });
    }
  }

  return chunks;
}
