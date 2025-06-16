// src/api/apiClient.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://assignment.devotel.io/api/insurance",
});

export default apiClient;
