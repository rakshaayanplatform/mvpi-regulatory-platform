import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_AUTH_URL, // Use env variable for auth service
  withCredentials: true, // If using cookies/session
});

export default api; 