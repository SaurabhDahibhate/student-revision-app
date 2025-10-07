import OpenAI from "openai";
import PDF from "../models/PDF.js";

// DON'T initialize here - do it inside the function
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateQuiz = async (
  pdfId,
  questionTypes = { MCQ: 3, SAQ: 2, LAQ: 1 }
) => {
  try {
    // Initialize OpenAI inside the function
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Get PDF content
    const pdf = await PDF.findById(pdfId);
    if (!pdf) {
      throw new Error("PDF not found");
    }

    // Extract text (limit to 3000 chars to avoid token limits)
    const textContent = pdf.textContent.substring(0, 3000);

    if (!textContent || textContent.trim().length < 100) {
      throw new Error(
        "PDF does not contain enough text content for quiz generation"
      );
    }

    // Create prompt for OpenAI
    const prompt = `You are an expert educator creating a quiz from study material.

Based on the following text from a student's coursebook, generate a quiz with:
- ${questionTypes.MCQ} Multiple Choice Questions (MCQ)
- ${questionTypes.SAQ} Short Answer Questions (SAQ)
- ${questionTypes.LAQ} Long Answer Questions (LAQ)

Text Content:
${textContent}

IMPORTANT: Return ONLY valid JSON in this exact format, with no additional text:
{
  "questions": [
    {
      "type": "MCQ",
      "question": "What is the main concept discussed?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "This is correct because..."
    },
    {
      "type": "SAQ",
      "question": "Explain the concept briefly.",
      "options": [],
      "correctAnswer": "Brief answer here",
      "explanation": "Detailed explanation"
    },
    {
      "type": "LAQ",
      "question": "Discuss in detail.",
      "options": [],
      "correctAnswer": "Detailed answer in 2-3 sentences",
      "explanation": "Complete explanation"
    }
  ]
}

Rules:
- MCQ must have exactly 4 options
- Questions should test understanding, not just recall
- Explanations should be educational and clear
- Ensure questions are unambiguous
- Return ONLY the JSON object, no markdown formatting`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates educational quiz questions in JSON format.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    // Parse response
    const responseText = completion.choices[0].message.content.trim();

    // Remove markdown code blocks if present
    const jsonText = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const quizData = JSON.parse(jsonText);

    return {
      pdfId: pdf._id,
      pdfName: pdf.originalName,
      questions: quizData.questions,
    };
  } catch (error) {
    console.error("Quiz generation error:", error);
    throw new Error(`Failed to generate quiz: ${error.message}`);
  }
};
