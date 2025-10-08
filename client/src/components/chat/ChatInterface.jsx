import { useState, useEffect, useRef } from "react";
import { Send, Plus, Trash2, MessageSquare, X, Loader } from "lucide-react";
import ReactMarkdown from "react-markdown";
import {
  getAllChats,
  createChat,
  getChatById,
  sendChatMessage,
  deleteChat,
} from "../../services/api";

export default function ChatInterface({
  onClose,
  initialPdfId = null,
  initialPdfName = null,
}) {
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    if (currentChat?.messages) {
      scrollToBottom();
    }
  }, [currentChat?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChats = async () => {
    try {
      setLoading(true);
      const data = await getAllChats();
      setChats(data.chats);

      // If no chats, create initial one
      if (data.chats.length === 0) {
        await handleNewChat();
      } else {
        // Load first chat
        await loadChat(data.chats[0].id);
      }
    } catch (error) {
      console.error("Failed to load chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadChat = async (chatId) => {
    try {
      const data = await getChatById(chatId);
      setCurrentChatId(chatId);
      setCurrentChat(data);
    } catch (error) {
      console.error("Failed to load chat:", error);
    }
  };

  const handleNewChat = async () => {
    try {
      const data = await createChat(
        "New Conversation",
        initialPdfId,
        initialPdfName
      );
      setChats((prev) => [data.chat, ...prev]);
      setCurrentChatId(data.chat.id);
      setCurrentChat(data.chat);
    } catch (error) {
      console.error("Failed to create chat:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim() || !currentChatId) return;

    const userMessage = message.trim();
    setMessage("");
    setSendingMessage(true);

    try {
      const data = await sendChatMessage(currentChatId, userMessage);
      setCurrentChat((prev) => ({
        ...prev,
        messages: data.chat.messages,
        title: data.chat.title,
      }));

      // Update chat list
      await loadChats();
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleDeleteChat = async (chatId) => {
    if (!window.confirm("Delete this conversation?")) return;

    try {
      await deleteChat(chatId);

      const updatedChats = chats.filter((c) => c.id !== chatId);
      setChats(updatedChats);

      if (currentChatId === chatId) {
        if (updatedChats.length > 0) {
          await loadChat(updatedChats[0].id);
        } else {
          await handleNewChat();
        }
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-700">
          <button
            onClick={handleNewChat}
            className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">New Chat</span>
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-3">
          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading...</div>
          ) : chats.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No conversations yet
            </div>
          ) : (
            <div className="space-y-2">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => loadChat(chat.id)}
                  className={`group p-3 rounded-lg cursor-pointer transition-colors ${
                    currentChatId === chat.id
                      ? "bg-gray-700"
                      : "hover:bg-gray-700/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <h3 className="text-sm font-medium text-white truncate">
                          {chat.title}
                        </h3>
                      </div>
                      {chat.pdfName && (
                        <p className="text-xs text-blue-400 truncate mb-1">
                          📄 {chat.pdfName}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 truncate">
                        {chat.lastMessage}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChat(chat.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-600 rounded transition-all"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Close Chat</span>
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {currentChat?.title || "New Conversation"}
              </h2>
              {currentChat?.pdfName && (
                <p className="text-sm text-blue-600 mt-1">
                  📄 Context: {currentChat.pdfName}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!currentChat ||
          !currentChat.messages ||
          currentChat.messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Start a conversation
                </h3>
                <p className="text-gray-500">
                  Ask me anything about your study materials!
                </p>
              </div>
            </div>
          ) : (
            <>
              {currentChat.messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-3xl rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-800 border border-gray-200"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown
                          components={{
                            p: ({ node, ...props }) => (
                              <p className="mb-2 last:mb-0" {...props} />
                            ),
                            strong: ({ node, ...props }) => (
                              <strong
                                className="font-bold text-gray-900"
                                {...props}
                              />
                            ),
                            em: ({ node, ...props }) => (
                              <em className="italic" {...props} />
                            ),
                            ul: ({ node, ...props }) => (
                              <ul
                                className="list-disc pl-5 mb-2 space-y-1"
                                {...props}
                              />
                            ),
                            ol: ({ node, ...props }) => (
                              <ol
                                className="list-decimal pl-5 mb-2 space-y-1"
                                {...props}
                              />
                            ),
                            li: ({ node, ...props }) => (
                              <li className="text-gray-800" {...props} />
                            ),
                            code: ({ node, inline, ...props }) =>
                              inline ? (
                                <code
                                  className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono"
                                  {...props}
                                />
                              ) : (
                                <code
                                  className="block bg-gray-100 p-3 rounded my-2 text-sm font-mono overflow-x-auto"
                                  {...props}
                                />
                              ),
                            h1: ({ node, ...props }) => (
                              <h1
                                className="text-xl font-bold mb-2 mt-4 text-gray-900"
                                {...props}
                              />
                            ),
                            h2: ({ node, ...props }) => (
                              <h2
                                className="text-lg font-bold mb-2 mt-3 text-gray-900"
                                {...props}
                              />
                            ),
                            h3: ({ node, ...props }) => (
                              <h3
                                className="text-base font-bold mb-2 mt-2 text-gray-900"
                                {...props}
                              />
                            ),
                            blockquote: ({ node, ...props }) => (
                              <blockquote
                                className="border-l-4 border-blue-500 pl-4 italic my-2"
                                {...props}
                              />
                            ),
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {sendingMessage && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                    <Loader className="w-5 h-5 animate-spin text-gray-500" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={sendingMessage}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={!message.trim() || sendingMessage}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-2 text-center">
            AI can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}
