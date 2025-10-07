import express from "express";
import {
  createQuiz,
  submitQuiz,
  getQuizAttempts,
} from "../controllers/quizController.js";

const router = express.Router();

// Generate new quiz
router.post("/generate", createQuiz);

// Submit quiz answers
router.post("/submit", submitQuiz);

// Get quiz attempts history
router.get("/attempts", getQuizAttempts);

export default router;
