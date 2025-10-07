import express from "express";
import {
  createQuiz,
  submitQuiz,
  getQuizAttempts,
  getProgressStats, // ADD THIS
} from "../controllers/quizController.js";

const router = express.Router();

// Generate new quiz
router.post("/generate", createQuiz);

// Submit quiz answers
router.post("/submit", submitQuiz);

// Get quiz attempts history
router.get("/attempts", getQuizAttempts);

// Get progress statistics - ADD THIS
router.get("/progress", getProgressStats);

export default router;
