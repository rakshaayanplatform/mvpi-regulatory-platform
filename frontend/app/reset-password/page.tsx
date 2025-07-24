"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";

export default function ResetPasswordPage() {
  const [phone_number, setPhone_number] = useState("");
  const [otp_code, setOtp_code] = useState("");
  const [new_password, setNew_password] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  async function handleSendOtp(e: any) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!phone_number) {
      setError("Please enter your phone number.");
      return;
    }
    setLoadingOtp(true);
    try {
      await api.post("http://100.97.106.2:8001/request-password-reset-otp/", {
        phone_number: phone_number, // ✅ correct key
      });
      setOtpSent(true);
      setSuccess("OTP sent to your phone number.");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to send OTP.");
    } finally {
      setLoadingOtp(false);
    }
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!phone_number || !otp_code || !new_password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoadingReset(true);
    try {
      await api.post("http://100.97.106.2:8001/reset-password/", {
        phone_number: phone_number,       // ✅ corrected key
        otp_code: otp_code,                   // ✅ corrected key
        new_password: new_password,       // ✅ corrected key
      });
      setSuccess("Password reset successful! Redirecting...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to reset password.");
    } finally {
      setLoadingReset(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center min-h-screen bg-[#CFFAFE]"
    >
      <div className="bg-white/60 border border-sky-200 rounded-lg p-8 min-w-[340px] max-w-md">
        <h2 className="text-2xl font-semibold text-blue-800 mb-6 text-center">Reset Password</h2>

        <input
          type="text"
          placeholder="Phone Number"
          value={phone_number}
          onChange={(e) => setPhone_number(e.target.value)}
          className="w-full border-b border-gray-400 bg-transparent text-gray-700 py-2 mb-4 focus:outline-none focus:border-blue-500"
        />

        <button
          type="button"
          className="w-full bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 rounded-full mb-4 transition"
          onClick={handleSendOtp}
          disabled={loadingOtp}
        >
          {loadingOtp ? "Sending..." : "Get OTP"}
        </button>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp_code}
          onChange={(e) => setOtp_code(e.target.value)}
          className="w-full border-b border-gray-400 bg-transparent text-gray-700 py-2 mb-4 focus:outline-none focus:border-blue-500"
        />

        <input
          type="password"
          placeholder="New Password"
          value={new_password}
          onChange={(e) => setNew_password(e.target.value)}
          className="w-full border-b border-gray-400 bg-transparent text-gray-700 py-2 mb-6 focus:outline-none focus:border-blue-500"
        />

        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        {success && <div className="text-green-600 text-sm mb-2">{success}</div>}

        <button
          type="submit"
          className="w-full bg-[#8ED100] hover:bg-lime-600 text-black font-bold py-2 rounded-full mb-4 transition"
          disabled={loadingReset}
        >
          {loadingReset ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </form>
  );
}
