"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";
import api from "@/utils/axiosInstance";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Optional: clear user-related localStorage on login page mount for clean state
    localStorage.removeItem("user_type");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    try {
      const response = await api.post("login/", { username, password });
      const data = response.data;
      console.log("Login response data:", data);
      if (response.status === 200) {
        // Optionally store user info if needed
        localStorage.setItem("userRole", data.role || "patient");
        localStorage.setItem("userName", data.name || username);
        localStorage.setItem("userEmail", data.email || "");
        if (data.user && data.user.user_type) {
          localStorage.setItem("user_type", data.user.user_type);
        }
        router.push("/dashboard");
      } else {
        setError("Invalid username or password.");
      }
    } catch (err: any) {
      if (err.response && err.response.status === 403) {
        setError("Email not verified. Please verify your email before logging in.");
      } else if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
      setError("Unable to connect to backend.");
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#CFFAFE]">
      {/* Centered content */}
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="relative flex flex-col md:flex-row items-center bg-transparent w-full max-w-4xl mx-auto rounded-lg shadow-none">
          
          {/* Background Image for small screens */}
          <div className="absolute inset-0 md:hidden z-0 opacity-30">
            <div className="relative w-full h-full">
              <Image
                src="/Right Side (1) 1.png"
                alt="Background"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>

          {/* Login Card */}
          <div className="w-full md:w-1/2 order-1 lg:order-1 flex justify-center z-10">
            <div className="bg-gradient-to-r from-gray-400/10 to-[#CFFAFE] border border-sky-300 rounded-md p-4 sm:p-6 w-full max-w-sm shadow-md text-center">
              <h2 className="text-2xl font-semibold text-blue-800 mb-6 text-center">Login to Your Account</h2>
              <form className="w-full" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Username / Mobile Number"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border-b border-gray-400 bg-transparent text-gray-700 py-2 mb-4 focus:outline-none focus:border-blue-500"
                />
                <div className="relative mb-6">
                <input
                    type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                    className="w-full border-b border-gray-400 bg-transparent text-gray-700 py-2 focus:outline-none focus:border-blue-500 pr-10"
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
                </div>
                {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
                <button
                  type="submit"
                  className="w-full bg-[#8ED100] hover:bg-lime-600 text-black font-bold py-2 rounded-full mb-4 transition"
                >
                  SIGN IN
                </button>
                <div className="flex flex-col items-center gap-1 text-sm">
                  <span
                    className="text-gray-600 underline hover:text-blue-600 cursor-pointer"
                    onClick={() => router.push("/reset-password")}
                  >
                    Forgot Password
                  </span>
                  <span
                    className="text-gray-600 underline hover:text-blue-600 cursor-pointer"
                    onClick={() => router.push("/register")}
                  >
                    Don’t Have an Account ?
                  </span>
                </div>
              </form>
            </div>
          </div>

          {/* Right: Image and Text (md+ only) */}
          <div className="hidden md:flex w-full md:w-1/2 order-2 lg:order-2 justify-center p-6 md:p-8">
            <div className="max-w-[320px] text-center">
              <h1 className="text-2xl font-bold text-blue-900 mb-1">Your Gateway to Medical Device Safety</h1>
              <p className="text-sm text-black mb-4">Login now for centralized control of your device safety reports</p>
              <Image
                src="/image/Right Side (1) 1.png"
                alt="Security Illustration"
                width={300}
                height={300}
                className="mx-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#CFFAFE] w-full text-center py-3">
        <p className="text-xs text-gray-600">
          © 2024 Rakshaayan. All rights reserved
        </p>
      </footer>
    </div>
  );
}