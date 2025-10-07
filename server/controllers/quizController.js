import Quiz from "../models/Quiz.js";
import QuizAttempt from "../models/QuizAttempt.js";
import { generateQuiz } from "../services/quizService.js";

// Generate a new quiz
export const createQuiz = async (req, res) => {
  try {
    const { pdfId, questionTypes } = req.body;

    // Generate quiz using OpenAI
    const quizData = await generateQuiz(pdfId, questionTypes);

    // Save quiz to database
    const quiz = new Quiz(quizData);
    await quiz.save();

    // Return quiz without correct answers (for frontend)
    const quizForFrontend = {
      id: quiz._id,
      pdfId: quiz.pdfId,
      pdfName: quiz.pdfName,
      questions: quiz.questions.map((q) => ({
        id: q._id,
        type: q.type,
        question: q.question,
        options: q.options,
      })),
      createdAt: quiz.createdAt,
    };

    res.status(201).json({
      message: "Quiz generated successfully",
      quiz: quizForFrontend,
    });
  } catch (error) {
    console.error("Create quiz error:", error);
    res.status(500).json({ error: error.message || "Failed to generate quiz" });
  }
};

// Submit quiz answers and get score
export const submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    // Get quiz with correct answers
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    // Calculate score
    const results = answers
      .map((userAnswer) => {
        const question = quiz.questions.id(userAnswer.questionId);

        if (!question) {
          return null;
        }

        const isCorrect =
          userAnswer.answer.trim().toLowerCase() ===
          question.correctAnswer.trim().toLowerCase();

        return {
          questionId: question._id,
          question: question.question,
          type: question.type,
          options: question.options,
          userAnswer: userAnswer.answer,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
          isCorrect,
        };
      })
      .filter((r) => r !== null);

    const correctCount = results.filter((r) => r.isCorrect).length;
    const totalQuestions = results.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);

    // Save attempt
    const attempt = new QuizAttempt({
      quizId: quiz._id,
      pdfId: quiz.pdfId,
      answers: results.map((r) => ({
        questionId: r.questionId,
        userAnswer: r.userAnswer,
        correctAnswer: r.correctAnswer,
        isCorrect: r.isCorrect,
      })),
      score: correctCount,
      totalQuestions,
      percentage,
    });

    await attempt.save();

    res.json({
      message: "Quiz submitted successfully",
      result: {
        attemptId: attempt._id,
        score: correctCount,
        totalQuestions,
        percentage,
        results,
      },
    });
  } catch (error) {
    console.error("Submit quiz error:", error);
    res.status(500).json({ error: "Failed to submit quiz" });
  }
};

// Get quiz attempts history
export const getQuizAttempts = async (req, res) => {
  try {
    const { pdfId } = req.query;

    const query = pdfId ? { pdfId } : {};
    const attempts = await QuizAttempt.find(query)
      .sort({ completedAt: -1 })
      .populate("pdfId", "originalName")
      .limit(50);

    res.json({ attempts });
  } catch (error) {
    console.error("Get attempts error:", error);
    res.status(500).json({ error: "Failed to fetch quiz attempts" });
  }
};
