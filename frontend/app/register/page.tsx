"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  const API_BASE_URL = "https://your-api-base-url.com"; // Replace this

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");

  const isFormValid =
    name &&
    email.includes("@") &&
    mobileNumber.length === 10 &&
    password.length >= 6 &&
    selectedUserType &&
    termsAccepted &&
    otpVerified;

  const handleSendOtp = async () => {
    if (mobileNumber.length !== 10) {
      setOtpError("Enter valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    setOtpError("");
    setOtpSuccess("");

    try {
      const res = await fetch(`${API_BASE_URL}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber }),
      });

      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        setOtpSuccess("OTP sent successfully to your mobile number.");
      } else {
        setOtpError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      setOtpError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6 || !otpSent) {
      setOtpError("Enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    setOtpError("");
    setOtpSuccess("");

    try {
      const res = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber, otp }),
      });

      const data = await res.json();
      if (res.ok && data.verified) {
        setOtpVerified(true);
        setOtpSuccess("OTP verified successfully.");
      } else {
        setOtpVerified(false);
        setOtpError(data.message || "Invalid OTP.");
      }
    } catch (err) {
      setOtpError("Verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!isFormValid) return;

    try {
      const payload = {
        name,
        email,
        mobileNumber,
        password,
        userType: selectedUserType,
      };

      const res = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/dashboard");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      alert("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 flex flex-col">
      <div className="py-6 text-center">
        <span className="text-2xl font-bold text-blue-900">LOGO</span>
      </div>

      <div className="max-w-xl w-full mx-auto bg-white shadow-lg border border-blue-200 p-8 rounded-xl">
        <h2 className="text-xl font-bold text-blue-900 mb-2">Create Your Account</h2>

        {/* User Type */}
        <div className="mb-4">
          <p className="font-bold mb-2">I am</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Doctor", value: "doctor", icon: "👨‍⚕️" },
              { label: "Patient", value: "patient", icon: "🧑‍🦽" },
              { label: "Manufacturer", value: "manufacturer", icon: "🏭" },
              { label: "Staff", value: "hospital_staff", icon: "🏥" },
              { label: "Media", value: "media", icon: "📰" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelectedUserType(opt.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium border ${
                  selectedUserType === opt.value
                    ? "bg-blue-100 border-blue-500 text-blue-700"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {opt.icon} {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full border-b py-2 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email ID"
            className="w-full border-b py-2 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Phone */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Mobile Number"
            className="w-full border-b py-2 outline-none"
            maxLength={10}
            value={mobileNumber}
            onChange={(e) => {
              setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10));
              setOtp("");
              setOtpVerified(false);
              setOtpSent(false);
              setOtpError("");
              setOtpSuccess("");
            }}
          />
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={otpSent || loading}
            className="mt-2 bg-lime-500 text-white px-4 py-1 rounded hover:bg-lime-600 text-sm"
          >
            {otpSent ? "OTP SENT" : loading ? "SENDING..." : "SEND OTP"}
          </button>
        </div>

        {/* OTP Input */}
        {otpSent && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              className="w-full border-b py-2 outline-none"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            />
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={loading || otpVerified}
              className="mt-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 text-sm"
            >
              {otpVerified ? "✔ Verified" : "Verify OTP"}
            </button>
            {otpError && <p className="text-red-500 text-sm mt-1">{otpError}</p>}
            {otpSuccess && <p className="text-green-600 text-sm mt-1">{otpSuccess}</p>}
          </div>
        )}

        {/* Password - Only after OTP verified */}
        {otpVerified && (
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              className="w-full border-b py-2 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        )}

        {/* Terms and Continue */}
        <div className="flex justify-between items-center mb-4">
          <label className="flex gap-2 text-sm">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="accent-lime-500"
            />
            <span>I accept the <span className="text-blue-500 underline">Terms</span></span>
          </label>
        </div>

        <button
          onClick={handleRegister}
          disabled={!isFormValid}
          className={`w-full py-2 rounded text-white font-semibold ${
            isFormValid ? "bg-lime-500 hover:bg-lime-600" : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          CONTINUE
        </button>
      </div>

      <footer className="text-center py-4 text-sm text-gray-600 mt-6">
        © 2024 Rakshaayan. All rights reserved.
      </footer>
    </div>
  );
}
