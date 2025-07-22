"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  const API_BASE_URL = "http://127.0.0.1:8001";

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [userType, setUserType] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");

  const isFormValid =
    username &&
    email.includes("@") &&
    mobileNumber.length === 10 &&
    password.length >= 6 &&
    userType &&
    termsAccepted &&
    otpVerified;

  const handleSendOtp = async () => {
    if (mobileNumber.length !== 10) {
      setOtpError("Enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    setOtpError("");
    setOtpSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile_number: mobileNumber }),
      });

      const data = await response.json();
      if (response.ok) {
        setOtpSent(true);
        setOtpSuccess("OTP sent successfully to your mobile.");
      } else {
        setOtpError(data.message || "Failed to send OTP.");
      }
    } catch (error) {
      setOtpError("Server not responding. Check backend or API URL.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setOtpError("Enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    setOtpError("");
    setOtpSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile_number: mobileNumber,
          otp,
        }),
      });

      const data = await response.json();
      if (response.ok && data.verified) {
        setOtpVerified(true);
        setOtpSuccess("OTP verified successfully.");
      } else {
        setOtpError(data.message || "Invalid OTP.");
      }
    } catch (error) {
      setOtpError("Verification failed. Server may be down.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!isFormValid) return;

    const payload = {
      username,
      usertype: userType,
      mobile_number: mobileNumber,
      email,
      password,
    };

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        router.push("/dashboard");
      } else {
        alert(data.message || "Registration failed.");
      }
    } catch (error) {
      alert("Something went wrong during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 flex flex-col">
      <div className="py-6 text-center">
        <span className="text-2xl font-bold text-blue-900">LOGO</span>
      </div>

      <div className="max-w-xl w-full mx-auto bg-white shadow-lg border border-blue-200 p-8 rounded-xl">
        <h2 className="text-xl font-bold text-blue-900 mb-2">Create Your Account</h2>

        {/* User Type Selection */}
        <div className="mb-4">
          <p className="font-bold mb-2">I am</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Doctor", value: "doctor", icon: "👨‍⚕️" },
              { label: "Patient", value: "patient", icon: "🧑‍🦽" },
              { label: "Manufacturer", value: "manufacturer", icon: "🏭" },
              { label: "Staff", value: "hospital_staff", icon: "🏥" },
              { label: "Media", value: "media", icon: "📰" },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setUserType(item.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium border ${
                  userType === item.value
                    ? "bg-blue-100 border-blue-500 text-blue-700"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Username */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full border-b py-2 outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

        {/* Mobile Number */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Mobile Number"
            className="w-full border-b py-2 outline-none"
            maxLength={10}
            value={mobileNumber}
            onChange={(e) => {
              setMobileNumber(e.target.value.replace(/\D/g, ""));
              setOtp("");
              setOtpSent(false);
              setOtpVerified(false);
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

        {/* OTP Field */}
        {otpSent && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter OTP"
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

        {/* Password Field */}
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

        {/* Terms & Conditions */}
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
          disabled={!isFormValid || loading}
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
