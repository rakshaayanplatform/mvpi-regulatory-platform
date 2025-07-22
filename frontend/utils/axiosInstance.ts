import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:8000", // Change to your backend URL
  withCredentials: true, // If using cookies/session
});
export default api; 