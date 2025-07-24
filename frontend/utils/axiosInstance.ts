import axios from "axios";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const part = parts.pop();
    if (part) return part.split(";").shift() || null;
  }
  return null;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_AUTH_URL || "http://localhost:8001",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getCookie("access_token");
  if (typeof window !== "undefined") {
    console.log("[axiosInstance] Interceptor running. Token:", token);
  }
  if (token) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${token}`;
    if (typeof window !== "undefined") {
      console.log("[axiosInstance] Authorization header set:", config.headers["Authorization"]);
    }
  }
  return config;
});

export default api; 