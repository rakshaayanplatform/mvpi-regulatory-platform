"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import api from "@/utils/axiosInstance";


export default function Signup() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [user_type, setUser_type] = useState("");
  const [otp_code, setOtp_code] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState("");
  const [otpError, setOtpError] = useState("");

  const handleSendOtp = async () => {
    setOtpError("");
    setOtpSuccess("");

    const response = await api.post("request-otp/", { phone_number });

    const data = response.data;

    if (response.status === 200) {
      setOtpSent(true);
      setOtpSuccess("OTP sent successfully to your mobile.");
    } else {
      setOtpError(data.error || data.message || "Failed to send OTP.");
    }
  };

 const handleVerifyOtp = async () => {
  setOtpError("");
  setOtpSuccess("");

  const response = await api.post("verify-otp/", { phone_number, otp_code });

  const data = response.data;

  if (response.status === 200 && data.message?.toLowerCase().includes("otp verified")) {
    setOtpVerified(true);
    setOtpSuccess(data.message || "OTP verified successfully.");
  } else {
    setOtpError(data.error || data.message || "Invalid OTP.");
  }
};

const canRegister =
  username.trim() !== "" &&
  email.trim() !== "" &&
  phone_number.trim() !== "" &&
  user_type.trim() !== "" &&
  otpVerified &&
  password.trim() !== "" &&
  termsAccepted;



  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!otp_code) {
      setOtpError("Please verify OTP before submitting.");
      return;
    }

    console.log("Starting registration process...");
    
    try {
      const response = await api.post("register/", {
          username,
          email,
          phone_number,
          user_type,
          password,
      });

      const data = response.data;
      console.log("Registration response:", response.status, data);

      if (response.status === 200 || response.status === 201) {
        console.log("Registration successful, setting localStorage...");
        localStorage.setItem("user_type", user_type);
        // Store user info for dashboard
        localStorage.setItem("userRole", user_type);
        localStorage.setItem("userName", username);
        localStorage.setItem("userEmail", email);
        
        // Try auto-login, but don't fail if email not verified
        try {
          const loginResponse = await api.post("login/", { username, password });
          console.log("Auto-login successful:", loginResponse.data);
          // Update stored user info with response data
          localStorage.setItem("userRole", loginResponse.data.user?.user_type || user_type);
          localStorage.setItem("userName", loginResponse.data.user?.username || username);
          localStorage.setItem("userEmail", loginResponse.data.user?.email || email);
        } catch (err: any) {
          console.log("Auto-login failed (expected if email not verified):", err?.response?.data);
          // Don't show error alert, just proceed to dashboard
          // The dashboard will handle email verification popup
        }
        
        console.log("Redirecting to dashboard...");
        // Always redirect to dashboard after successful registration
        await router.push("/dashboard");
        console.log("Router push completed");
      } else {
        console.error("Registration failed with status:", response.status);
        alert(data.message || "Registration failed");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      alert(error?.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#CFFAFE] px-4">
      <div className="py-6 text-center">
        <span className="text-2xl font-bold text-blue-900">LOGO</span>
      </div>

      <div className="flex-grow">
        <form
          onSubmit={handleSubmit}
          className="max-w-xl w-full mx-auto bg-blue-50 border-2 border-blue-200 shadow-lg rounded-xl p-6 md:p-8 space-y-6"
        >
          <h2 className="text-xl font-bold text-blue-900 mb-2">Create Your Account</h2>

          <div className="mb-4">
            {/* Role selection UI */}
            <div className="font-bold mb-2 text-gray-700 text-base text-center">Select Your Role</div>
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 lg:gap-4">
              {[
                "patient",
                "hospital",
                "manufacturer",
                "government_official",
                "coordinator",
              ].map((role, i) => {
                const icons = ["🧑", "🏥", "🏭", "🏛", "🧑‍💼"];
                const labels = [
                  "Patient",
                  "Hospital Staff",
                  "Manufacturer",
                  "Gov. Official",
                  "Coordinator",
                ];
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setUser_type(role)}
                    className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg text-sm font-semibold border-2 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
                      bg-blue-100 text-blue-800
                      ${user_type === role
                        ? "border-blue-600 scale-105 ring-2 ring-blue-300 bg-blue-200"
                        : "border-transparent hover:scale-105 hover:shadow-md opacity-90 hover:opacity-100"}
                    `}
                    style={{ minWidth: 90, minHeight: 48 }}
                  >
                    <span className="text-lg mb-0.5">{icons[i]}</span>
                    <span className="text-xs md:text-sm lg:text-base">{labels[i]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {[{
            label: "Full Name",
            value: username,
            setValue: setUsername,
            type: "text"
          }, {
            label: "Email ID",
            value: email,
            setValue: setEmail,
            type: "email"
          }].map((field) => (
            <div className="relative" key={field.label}>
              <label className="block relative cursor-text">
                <input
                  type={field.type}
                  value={field.value}
                  onChange={(e) => field.setValue(e.target.value)}
                  className="peer w-full border-b border-gray-400 bg-transparent py-4 placeholder-transparent focus:outline-none focus:border-blue-500"
                  placeholder={field.label}
                />
                <span className="absolute left-0 top-0 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-600">
                  {field.label}
                </span>
              </label>
            </div>
          ))}

          <div className="flex items-end gap-2 flex-wrap md:flex-nowrap">
           <div className="flex items-end gap-2 flex-wrap md:flex-nowrap">
  <div className="relative flex-grow">
    <label className="block mb-1 text-sm text-gray-500">Mobile Number</label>
    <PhoneInput
      country={'in'}
      value={phone_number}
      onChange={(phone) => setPhone_number(phone)}
      inputClass="!bg-transparent !border-b !border-gray-400 !w-full !py-4 !focus:outline-none !focus:border-blue-500"
      containerClass="!w-full"
    />
  </div>
</div>

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={otpSent}
              className="shrink-0 bg-lime-500 text-white px-4 py-2 rounded-full hover:bg-lime-600 text-sm mt-1"
            >
              {otpSent ? "OTP SENT" : "SEND OTP"}
            </button>
          </div>

          {otpSent && (
            <>
              <div className="flex items-end gap-2 flex-wrap md:flex-nowrap">
                <div className="relative flex-grow">
                  <label className="block relative cursor-text">
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      className="peer w-full border-b border-gray-400 bg-transparent py-4 placeholder-transparent focus:outline-none focus:border-blue-500"
                      value={otp_code}
                      onChange={(e) => setOtp_code(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    />
                    <span className="absolute left-0 top-0 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-600">
                      Enter 6-digit OTP
                    </span>
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={otpVerified}
                  className="shrink-0 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm mt-1"
                >
                  {otpVerified ? "✔ Verified" : "Verify OTP"}
                </button>
              </div>

             <div className="relative">
  <label className="block relative cursor-text">
    <input
      type={showPassword ? "text" : "password"}
      placeholder="Password"
      className="peer w-full border-b border-gray-400 bg-transparent py-4 placeholder-transparent focus:outline-none focus:border-blue-500 pr-10"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    <button
      type="button"
      tabIndex={-1}
      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 focus:outline-none"
      onClick={() => setShowPassword((v) => !v)}
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.236.938-4.675m1.675-2.675A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.336 3.236-.938 4.675m-1.675 2.675A9.956 9.956 0 0112 21c-1.657 0-3.236-.336-4.675-.938m-2.675-1.675A9.956 9.956 0 013 12c0-1.657.336-3.236.938-4.675m1.675-2.675A9.956 9.956 0 0112 3c1.657 0 3.236.336 4.675.938m2.675 1.675A9.956 9.956 0 0121 12c0 1.657-.336 3.236-.938 4.675m-1.675 2.675A9.956 9.956 0 0112 21z" /></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.832-.64 1.624-1.09 2.357M15.54 15.54A9.956 9.956 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.236.938-4.675m1.675-2.675A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.336 3.236-.938 4.675m-1.675 2.675A9.956 9.956 0 0112 21c-1.657 0-3.236-.336-4.675-.938m-2.675-1.675A9.956 9.956 0 013 12z" /></svg>
      )}
    </button>
    <span className="absolute left-0 top-0 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-600">
      Password
    </span>
  </label>

  {/* Validation Messages */}
  {password && (
    <div className="mt-2 text-sm text-red-500 space-y-1">
      {!/^.{8,}$/.test(password) && <p>• At least 8 characters</p>}
      {!/[A-Z]/.test(password) && <p>• At least one uppercase letter</p>}
      {!/[a-z]/.test(password) && <p>• At least one lowercase letter</p>}
      {!/[0-9]/.test(password) && <p>• At least one digit</p>}
      {!/[^A-Za-z0-9]/.test(password) && <p>• At least one special character</p>}
    </div>
  )}
</div>

            </>
          )}

          {otpError && <p className="text-red-500 text-sm mb-1">{otpError}</p>}
          {otpSuccess && <p className="text-green-600 text-sm mb-1">{otpSuccess}</p>}

          <div className="flex justify-between items-center">
            <label className="flex gap-2 text-sm">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="accent-lime-500"
              />
              <span>
                I accept the <span className="text-blue-500 underline">Terms</span>
              </span>
            </label>
            <button
  type="submit"
  className={`py-2 px-6 rounded-full text-white font-semibold ${
    canRegister ? "bg-lime-500 hover:bg-lime-600" : "bg-gray-300 cursor-not-allowed"
  }`}
  disabled={!canRegister}
>
  Register
</button>

          </div>
        </form>
      </div>

      <footer className="text-center py-4 text-sm text-gray-600">
        © 2024 Rakshaayan. All rights reserved.
      </footer>
    </div>
  );
}
