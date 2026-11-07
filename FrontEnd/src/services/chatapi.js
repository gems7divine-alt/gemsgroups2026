import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_CHAT_API_BASE_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Ask the RAG chatbot a question. Returns { answer, sources }.
export const askAssistant = async (question, history, signal) => {
  const response = await API.post("/chat", { question, history }, { signal });
  return response.data;
};
