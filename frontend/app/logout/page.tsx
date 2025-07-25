"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";

export default function LogoutPage() {
  const router = useRouter();
  useEffect(() => {
    async function logout() {
      try {
        await api.post("/logout/");
      } catch (e) {
        // Ignore errors
      }
      if (typeof window !== "undefined") {
        localStorage.removeItem("userRole");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("user_type");
      }
      router.replace("/login");
    }
    logout();
  }, [router]);
  return <div>Logging out...</div>;
} 