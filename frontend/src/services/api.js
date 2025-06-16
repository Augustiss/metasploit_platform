// frontend/src/services/api.js
import axios from "axios";

export async function registerUser(userData) {
  const response = await axios.post("http://localhost:8000/users/", userData);
  return response.data;
}
