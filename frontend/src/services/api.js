// frontend/src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://161.35.18.245:8000",
});


api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function registerUser(userData) {
  const response = await api.post("/users/", userData);
  return response.data;
}

export default api;
