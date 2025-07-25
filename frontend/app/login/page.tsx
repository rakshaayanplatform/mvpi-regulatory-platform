"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    try {
      const response = await api.post("/login/", { username, password });
      const data = response.data;
      localStorage.setItem("user_type", data.role || "patient");
      localStorage.setItem("userName", data.name || username);
      localStorage.setItem("userEmail", data.email || "");
      // Optionally remove old keys for consistency
      localStorage.removeItem("userRole");
      router.push("/dashboard");
    } catch (err: any) {
      if (err?.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err?.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Invalid username or password.");
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
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      // Eye open SVG
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                      </svg>
                    ) : (
                      // Eye closed SVG
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 002.25 12s3.75 7.5 9.75 7.5c1.956 0 3.74-.5 5.272-1.272M6.228 6.228A10.45 10.45 0 0112 4.5c6 0 9.75 7.5 9.75 7.5a17.896 17.896 0 01-3.478 4.752M6.228 6.228l11.544 11.544M6.228 6.228L3 3m15.75 15.75L21 21" />
                      </svg>
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