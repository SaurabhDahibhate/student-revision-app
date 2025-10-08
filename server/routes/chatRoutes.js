import express from "express";
import {
  createChat,
  getAllChats,
  getChatById,
  sendMessage,
  deleteChat,
} from "../controllers/chatController.js";

const router = express.Router();

// Create new chat
router.post("/", createChat);

// Get all chats
router.get("/", getAllChats);

// Get single chat
router.get("/:id", getChatById);

// Send message
router.post("/:chatId/message", sendMessage);

// Delete chat
router.delete("/:id", deleteChat);

export default router;
