"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();
  useEffect(() => {
    // Clear dummy session (for integration, clear auth tokens here)
    if (typeof window !== "undefined") {
      localStorage.removeItem("userRole");
    }
    router.replace("/login");
  }, [router]);
  return <div>Logging out...</div>;
} 