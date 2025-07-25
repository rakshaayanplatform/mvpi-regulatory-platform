"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { removeAccessToken } from "@/utils/token";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    removeAccessToken();
    router.replace("/login");
  }, [router]);

  return <div>Logging out...</div>;
}
