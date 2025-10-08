import Chat from "../models/Chat.js";
import { generateChatResponse } from "../services/chatService.js";

// Create new chat
export const createChat = async (req, res) => {
  try {
    const { title, pdfId, pdfName } = req.body;

    const chat = new Chat({
      title: title || "New Conversation",
      pdfId: pdfId || null,
      pdfName: pdfName || null,
      messages: [],
    });

    await chat.save();

    res.status(201).json({
      message: "Chat created successfully",
      chat: {
        id: chat._id,
        title: chat.title,
        pdfId: chat.pdfId,
        pdfName: chat.pdfName,
        messages: chat.messages,
        createdAt: chat.createdAt,
      },
    });
  } catch (error) {
    console.error("Create chat error:", error);
    res.status(500).json({ error: "Failed to create chat" });
  }
};

// Get all chats
export const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find()
      .sort({ updatedAt: -1 })
      .select("title pdfName messages createdAt updatedAt");

    const chatList = chats.map((chat) => ({
      id: chat._id,
      title: chat.title,
      pdfName: chat.pdfName,
      messageCount: chat.messages.length,
      lastMessage:
        chat.messages.length > 0
          ? chat.messages[chat.messages.length - 1].content.substring(0, 50) +
            "..."
          : "No messages yet",
      updatedAt: chat.updatedAt,
    }));

    res.json({ chats: chatList });
  } catch (error) {
    console.error("Get chats error:", error);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
};

// Get single chat
export const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.json({
      id: chat._id,
      title: chat.title,
      pdfId: chat.pdfId,
      pdfName: chat.pdfName,
      messages: chat.messages,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    });
  } catch (error) {
    console.error("Get chat error:", error);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
};

// Send message in chat
export const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    // Add user message
    chat.messages.push({
      role: "user",
      content: message,
    });

    // Generate AI response
    const aiResponse = await generateChatResponse(chat.messages, chat.pdfId);

    // Add assistant message
    chat.messages.push({
      role: "assistant",
      content: aiResponse,
    });

    // Update title if first message
    if (chat.messages.length === 2) {
      chat.title =
        message.substring(0, 50) + (message.length > 50 ? "..." : "");
    }

    chat.updatedAt = new Date();
    await chat.save();

    res.json({
      message: "Message sent successfully",
      chat: {
        id: chat._id,
        messages: chat.messages,
        title: chat.title,
      },
    });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

// Delete chat
export const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findByIdAndDelete(req.params.id);

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Delete chat error:", error);
    res.status(500).json({ error: "Failed to delete chat" });
  }
};
