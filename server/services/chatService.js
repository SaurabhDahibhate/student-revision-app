import Groq from 'groq-sdk';
import PDF from '../models/PDF.js';

export const generateChatResponse = async (messages, pdfId = null) => {
  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    let systemPrompt = "You are a helpful AI teaching assistant. You help students understand their study materials, answer questions clearly, and provide educational explanations.";

    // If there's a PDF context, add it
    if (pdfId) {
      const pdf = await PDF.findById(pdfId);
      if (pdf && pdf.textContent) {
        const contextText = pdf.textContent.substring(0, 2000); // Limit context
        systemPrompt += `\n\nContext from the student's PDF (${pdf.originalName}):\n${contextText}\n\nUse this context to answer questions when relevant.`;
      }
    }

    // Format messages for Groq
    const groqMessages = [
      {
        role: "system",
        content: systemPrompt
      },
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    // Call Groq API
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: groqMessages,
      temperature: 0.7,
      max_tokens: 1000
    });

    return completion.choices[0].message.content;

  } catch (error) {
    console.error('Chat generation error:', error);
    throw new Error(`Failed to generate response: ${error.message}`);
  }
};