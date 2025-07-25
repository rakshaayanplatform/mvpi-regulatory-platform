"use client";
import { useState } from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";

export default function ResetPasswordPage() {
  const [phone_number, setPhone_number] = useState("");
  const [otp_code, setOtp_code] = useState("");
  const [new_password, setNew_password] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      await api.post("request-password-reset-otp/", {
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
      await api.post("reset-password/", {
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

        <div className="mb-4">
          <label className="block mb-1 text-sm text-gray-500">Mobile Number</label>
          <PhoneInput
            country={'in'}
          value={phone_number}
            onChange={(phone) => setPhone_number(phone)}
            inputClass="!bg-transparent !border-b !border-gray-400 !w-full !py-4 !focus:outline-none !focus:border-blue-500"
            containerClass="!w-full"
        />
        </div>

        <button
          type="button"
          className="w-full bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 rounded-full mb-4 transition"
          onClick={handleSendOtp}
          disabled={loadingOtp || otpSent}
        >
          {loadingOtp ? "Sending..." : otpSent ? "OTP Sent" : "Get OTP"}
        </button>

        {/* OTP and new password fields, only after OTP is sent */}
        {otpSent && (
          <>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp_code}
          onChange={(e) => setOtp_code(e.target.value)}
          className="w-full border-b border-gray-400 bg-transparent text-gray-700 py-2 mb-4 focus:outline-none focus:border-blue-500"
        />
            <div className="relative flex items-center mb-6">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={new_password}
                onChange={(e) => setNew_password(e.target.value)}
                className="w-full border-b border-gray-400 bg-transparent text-gray-700 py-2 focus:outline-none focus:border-blue-500 pr-12"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 focus:outline-none"
                style={{padding: 0, margin: 0, height: '2rem', width: '2rem'}}
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.236.938-4.675m1.675-2.675A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.336 3.236-.938 4.675m-1.675 2.675A9.956 9.956 0 0112 21c-1.657 0-3.236-.336-4.675-.938m-2.675-1.675A9.956 9.956 0 013 12c0-1.657.336-3.236.938-4.675m1.675-2.675A9.956 9.956 0 0112 3c1.657 0 3.236.336 4.675.938m2.675 1.675A9.956 9.956 0 0121 12c0 1.657-.336 3.236-.938 4.675m-1.675 2.675A9.956 9.956 0 0112 21z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.832-.64 1.624-1.09 2.357M15.54 15.54A9.956 9.956 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.236.938-4.675m1.675-2.675A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.336 3.236-.938 4.675m-1.675 2.675A9.956 9.956 0 0112 21c-1.657 0-3.236-.336-4.675-.938m-2.675-1.675A9.956 9.956 0 013 12z" /></svg>
                )}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-[#8ED100] hover:bg-lime-600 text-black font-bold py-2 rounded-full mb-4 transition"
              disabled={loadingReset}
            >
              {loadingReset ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}

        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        {success && <div className="text-green-600 text-sm mb-2">{success}</div>}
      </div>
    </form>
  );
}
