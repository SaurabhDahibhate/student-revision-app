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

    // If there's a PDF context, use RAG (if embeddings exist)
    if (pdfId) {
      const pdf = await PDF.findById(pdfId);
      if (pdf && pdf.chunks && pdf.chunks.length > 0) {
        const lastUserMessage = messages[messages.length - 1]?.content || "";

        if (lastUserMessage) {
          // Check if embeddings exist
          const hasEmbeddings =
            pdf.chunks[0].embedding && pdf.chunks[0].embedding.length > 0;

          if (hasEmbeddings && process.env.OPENAI_API_KEY) {
            console.log("🔍 Performing RAG search with embeddings...");

            try {
              const queryEmbedding = await createEmbedding(lastUserMessage);

              const chunksWithScores = pdf.chunks.map((chunk) => ({
                ...chunk.toObject(),
                similarity: cosineSimilarity(queryEmbedding, chunk.embedding),
              }));

              const topChunks = chunksWithScores
                .sort((a, b) => b.similarity - a.similarity)
                .slice(0, 3);

              console.log(`📚 Found ${topChunks.length} relevant chunks`);

              let contextInfo = "\n\nRelevant information from the PDF:\n\n";
              topChunks.forEach((chunk) => {
                contextInfo += `[Source: Page ${
                  chunk.pageNumber
                }]\n"${chunk.text.substring(0, 200)}..."\n\n`;
              });

              systemPrompt += `\n\nContext from ${pdf.originalName}:${contextInfo}`;
              systemPrompt += `\n\nIMPORTANT: Cite page numbers when answering. Format: "According to page X: [quote]"`;
            } catch (error) {
              console.error("RAG search error:", error.message);
              // Fall back to basic context
              const contextText = pdf.textContent.substring(0, 2000);
              systemPrompt += `\n\nContext from ${pdf.originalName}:\n${contextText}`;
            }
          } else {
            // For No embeddings then use simple text context
            console.log("📄 Using simple text context (no embeddings)");
            const contextText = pdf.textContent.substring(0, 2000);
            systemPrompt += `\n\nContext from ${pdf.originalName}:\n${contextText}\n\nUse this context when relevant.`;
          }
        }
      }
    }

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
