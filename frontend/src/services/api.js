// frontend/src/services/api.js
import axios from "axios";

export async function registerUser(userData) {
  const response = await axios.post("http://161.35.18.245:8000/users/", userData);
  return response.data;
}
