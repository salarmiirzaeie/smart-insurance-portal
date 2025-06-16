// src/api/apiClient.ts
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: apiUrl || "https://assignment.devotel.io/api/insurance",
});

export default apiClient;
