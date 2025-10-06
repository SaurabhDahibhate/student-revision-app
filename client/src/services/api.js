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

export default api;
