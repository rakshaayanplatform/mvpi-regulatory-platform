"use client";
import { useRouter } from "next/navigation";

export default function RequestPasswordResetOtpPage() {
  const router = useRouter();
  function handleSubmit(e: any) {
    e.preventDefault();
    // For integration, send axios request here
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