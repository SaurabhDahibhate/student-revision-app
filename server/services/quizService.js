import OpenAI from "openai";
import PDF from "../models/PDF.js";

// Set to true to use mock data instead of OpenAI
const USE_MOCK_DATA = true; // ← Change to false when you have OpenAI credits

export const generateQuiz = async (
  pdfId,
  questionTypes = { MCQ: 3, SAQ: 2, LAQ: 1 }
) => {
  try {
    // Get PDF content
    const pdf = await PDF.findById(pdfId);
    if (!pdf) {
      throw new Error("PDF not found");
    }

    // MOCK MODE - For testing without OpenAI credits
    if (USE_MOCK_DATA) {
      console.log("🎭 Using MOCK quiz data (OpenAI bypassed)");

      const mockQuestions = [
        // MCQs
        {
          type: "MCQ",
          question: "What is the main topic covered in this document?",
          options: [
            "Introduction to Physics concepts",
            "Mathematical equations",
            "Historical events",
            "Chemical reactions",
          ],
          correctAnswer: "Introduction to Physics concepts",
          explanation:
            "Based on the document content, physics concepts are the primary focus.",
        },
        {
          type: "MCQ",
          question: "Which of the following is a key principle discussed?",
          options: [
            "Newton's Laws of Motion",
            "Photosynthesis",
            "Economic Theory",
            "Literary Analysis",
          ],
          correctAnswer: "Newton's Laws of Motion",
          explanation:
            "The document extensively covers Newton's fundamental laws.",
        },
        {
          type: "MCQ",
          question: "What measurement unit is most commonly used in the text?",
          options: [
            "Meters and seconds",
            "Dollars and cents",
            "Degrees Celsius",
            "Pounds and ounces",
          ],
          correctAnswer: "Meters and seconds",
          explanation: "SI units are standard in physics documentation.",
        },
        // SAQs
        {
          type: "SAQ",
          question: "Define velocity in your own words.",
          options: [],
          correctAnswer:
            "Velocity is the rate of change of displacement with respect to time",
          explanation:
            "Velocity is a vector quantity representing speed in a specific direction.",
        },
        {
          type: "SAQ",
          question: "What is the relationship between force and acceleration?",
          options: [],
          correctAnswer: "Force equals mass times acceleration (F=ma)",
          explanation:
            "This is Newton's second law of motion, fundamental to classical mechanics.",
        },
        // LAQ
        {
          type: "LAQ",
          question:
            "Explain the concept of momentum and how it relates to collisions.",
          options: [],
          correctAnswer:
            "Momentum is the product of mass and velocity. In collisions, the total momentum of a system is conserved, meaning the total momentum before collision equals the total momentum after collision.",
          explanation:
            "The law of conservation of momentum states that in a closed system, momentum remains constant. This principle is crucial for understanding elastic and inelastic collisions.",
        },
      ];

      return {
        pdfId: pdf._id,
        pdfName: pdf.originalName,
        questions: mockQuestions,
      };
    }

    // REAL OPENAI MODE - Below code runs when USE_MOCK_DATA = false
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

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
