import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Use env variable for backend URL
  withCredentials: true, // If using cookies/session
});

export default instance; 