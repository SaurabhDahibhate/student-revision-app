import Quiz from "../models/Quiz.js";
import QuizAttempt from "../models/QuizAttempt.js";
import { generateQuiz } from "../services/quizService.js";

// Generate a new quiz
export const createQuiz = async (req, res) => {
  try {
    const { pdfId, questionTypes } = req.body;

    // Generate quiz using OpenAI
    const quizData = await generateQuiz(pdfId, questionTypes);

    // Save to database
    const quiz = new Quiz(quizData);
    await quiz.save();

    // Return without correct answers
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

// Submit quiz and get score
export const submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    // Calculate score
    const results = answers
      .map((userAnswer) => {
        const question = quiz.questions.id(userAnswer.questionId);
        if (!question) return null;

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

// Get quiz attempts
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
    res.status(500).json({ error: "Failed to fetch attempts" });
  }
};

// NEW: Get progress statistics
export const getProgressStats = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find()
      .sort({ completedAt: -1 })
      .populate("pdfId", "originalName");

    if (attempts.length === 0) {
      return res.json({
        totalAttempts: 0,
        averageScore: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        recentAttempts: [],
        performanceByType: {
          MCQ: { correct: 0, total: 0, percentage: 0 },
          SAQ: { correct: 0, total: 0, percentage: 0 },
          LAQ: { correct: 0, total: 0, percentage: 0 },
        },
        scoreDistribution: [],
      });
    }

    // Calculate overall statistics
    const totalAttempts = attempts.length;
    const totalQuestions = attempts.reduce(
      (sum, a) => sum + a.totalQuestions,
      0
    );
    const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);
    const averageScore = Math.round((totalScore / totalQuestions) * 100);

    // Calculate correct/incorrect
    const correctAnswers = attempts.reduce((sum, a) => sum + a.score, 0);
    const incorrectAnswers = totalQuestions - correctAnswers;

    // Recent attempts (last 10)
    const recentAttempts = attempts.slice(0, 10).map((a) => ({
      id: a._id,
      pdfName: a.pdfId?.originalName || "Unknown PDF",
      score: a.score,
      totalQuestions: a.totalQuestions,
      percentage: a.percentage,
      completedAt: a.completedAt,
    }));

    // Performance by question type
    const performanceByType = {
      MCQ: { correct: 0, total: 0, percentage: 0 },
      SAQ: { correct: 0, total: 0, percentage: 0 },
      LAQ: { correct: 0, total: 0, percentage: 0 },
    };

    // Fetch quizzes to get question types
    for (const attempt of attempts) {
      const quiz = await Quiz.findById(attempt.quizId);
      if (quiz) {
        attempt.answers.forEach((answer) => {
          const question = quiz.questions.id(answer.questionId);
          if (question && performanceByType[question.type]) {
            performanceByType[question.type].total++;
            if (answer.isCorrect) {
              performanceByType[question.type].correct++;
            }
          }
        });
      }
    }

    // Calculate percentages
    Object.keys(performanceByType).forEach((type) => {
      const { correct, total } = performanceByType[type];
      performanceByType[type].percentage =
        total > 0 ? Math.round((correct / total) * 100) : 0;
    });

    // Score distribution
    const scoreDistribution = attempts.map((a) => ({
      date: a.completedAt,
      percentage: a.percentage,
    }));

    res.json({
      totalAttempts,
      averageScore,
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      recentAttempts,
      performanceByType,
      scoreDistribution,
    });
  } catch (error) {
    console.error("Get progress stats error:", error);
    res.status(500).json({ error: "Failed to fetch progress statistics" });
  }
};
