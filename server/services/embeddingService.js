import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY,
});

// Create embedding for text using OpenAI
export async function createEmbedding(text) {
  try {
    // Truncate text if too long (max 8000 tokens ≈ 6000 words)
    const truncatedText = text.substring(0, 6000);

    const response = await openai.embeddings.create({
      model: "text-embedding-3-small", // Free tier model
      input: truncatedText,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error("Embedding error:", error.message);
    // Return empty embedding on error to prevent crash
    return new Array(1536).fill(0);
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
