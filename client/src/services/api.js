import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// PDF APIs
export const uploadPDF = async (file) => {
  const formData = new FormData();
  formData.append("pdf", file);

  const response = await api.post("/pdfs/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getAllPDFs = async () => {
  const response = await api.get("/pdfs");
  return response.data;
};

export const getPDFById = async (id) => {
  const response = await api.get(`/pdfs/${id}`);
  return response.data;
};

export const getPDFFileUrl = (id) => {
  return `${API_BASE_URL}/pdfs/${id}/file`;
};

export const deletePDF = async (id) => {
  const response = await api.delete(`/pdfs/${id}`);
  return response.data;
};

// Quiz APIs
export const generateQuiz = async (
  pdfId,
  questionTypes = { MCQ: 3, SAQ: 2, LAQ: 1 }
) => {
  const response = await api.post("/quiz/generate", { pdfId, questionTypes });
  return response.data;
};

export const submitQuiz = async (quizId, answers) => {
  const response = await api.post("/quiz/submit", { quizId, answers });
  return response.data;
};

export const getQuizAttempts = async (pdfId = null) => {
  const params = pdfId ? { pdfId } : {};
  const response = await api.get("/quiz/attempts", { params });
  return response.data;
};

export const getProgressStats = async () => {
  const response = await api.get("/quiz/progress");
  return response.data;
};

// Chat APIs
export const createChat = async (
  title = "New Conversation",
  pdfId = null,
  pdfName = null
) => {
  const response = await api.post("/chats", { title, pdfId, pdfName });
  return response.data;
};

export const getAllChats = async () => {
  const response = await api.get("/chats");
  return response.data;
};

export const getChatById = async (id) => {
  const response = await api.get(`/chats/${id}`);
  return response.data;
};

export const sendChatMessage = async (chatId, message) => {
  const response = await api.post(`/chats/${chatId}/message`, { message });
  return response.data;
};

export const deleteChat = async (id) => {
  const response = await api.delete(`/chats/${id}`);
  return response.data;
};

export default api;
