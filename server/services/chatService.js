import Groq from "groq-sdk";
import PDF from "../models/PDF.js";
import { createEmbedding, cosineSimilarity } from "./embeddingService.js";

export const generateChatResponse = async (messages, pdfId = null) => {
  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    let systemPrompt =
      "You are a helpful AI teaching assistant. You help students understand their study materials, answer questions clearly, and provide educational explanations.";
    let contextInfo = "";

    // If there's a PDF context, use RAG
    if (pdfId) {
      const pdf = await PDF.findById(pdfId);
      if (pdf && pdf.chunks && pdf.chunks.length > 0) {
        // Get the last user message
        const lastUserMessage = messages[messages.length - 1]?.content || "";

        if (lastUserMessage) {
          console.log("🔍 Performing RAG search...");

          // Create embedding for user query
          const queryEmbedding = await createEmbedding(lastUserMessage);

          // Find most relevant chunks
          const chunksWithScores = pdf.chunks.map((chunk) => ({
            ...chunk.toObject(),
            similarity: cosineSimilarity(queryEmbedding, chunk.embedding),
          }));

          // Sort by similarity and get top 3
          const topChunks = chunksWithScores
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 3);

          console.log(`📚 Found ${topChunks.length} relevant chunks`);

          // Build context with citations
          contextInfo = "\n\nRelevant information from the PDF:\n\n";
          topChunks.forEach((chunk, index) => {
            contextInfo += `[Source: Page ${
              chunk.pageNumber
            }]\n"${chunk.text.substring(0, 200)}..."\n\n`;
          });

          systemPrompt += `\n\nContext from the student's PDF (${pdf.originalName}):${contextInfo}`;
          systemPrompt += `\n\nIMPORTANT: When answering, cite the page numbers from the sources above. Use format: "According to page X: [quote snippet]"`;
        }
      }
    }

    // Format messages for Groq
    const groqMessages = [
      {
        role: "system",
        content: systemPrompt,
      },
      ...messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    // Call Groq API
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: groqMessages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Chat generation error:", error);
    throw new Error(`Failed to generate response: ${error.message}`);
  }
};
