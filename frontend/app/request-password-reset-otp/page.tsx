"use client";
import { useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";

export default function RequestPasswordResetOtpPage() {
  const router = useRouter();
  function handleSubmit(e: any) {
    e.preventDefault();
    // For integration, send axios request here
    api.post("request-password-reset-otp/", { /* TODO: add contact info */ });
    router.push("/reset-password");
  }
  return (
    <form onSubmit={handleSubmit}>
      <h2>Request Password Reset OTP</h2>
      <input placeholder="Email or Phone" name="contact" /><br/>
      <button type="submit">Request OTP</button>
    </form>
  );
} 