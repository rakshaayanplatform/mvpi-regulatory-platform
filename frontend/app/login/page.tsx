"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }
    try {
      const res = await api.post("/auth/login/", { username, password });
      // Store user info in localStorage for profile/dashboard
      localStorage.setItem("userRole", res.data.role || "patient");
      localStorage.setItem("userName", res.data.name || username);
      localStorage.setItem("userEmail", res.data.email || "");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Invalid credentials");
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#CFFAFE]">
      {/* Centered content */}
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col md:flex-row bg-transparent w-full max-w-4xl mx-auto rounded-lg shadow-none">
          {/* Left: Login Card */}
          <div className="flex-1 bg-white/60 border border-sky-200 rounded-lg p-8 flex flex-col justify-center items-center min-w-[340px] max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-blue-800 mb-6 text-center">Login to Your Account</h2>
            <form className="w-full" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Username / Mobile Number"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full border-b border-gray-400 bg-transparent text-gray-700 py-2 mb-4 focus:outline-none focus:border-blue-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border-b border-gray-400 bg-transparent text-gray-700 py-2 mb-6 focus:outline-none focus:border-blue-500"
              />
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
          {/* Right: Illustration and Text */}
          <div className="flex-1 flex flex-col justify-center items-center p-8">
            {/* Removed heading and description, only image remains */}
            <div className="mt-[-32px]"> {/* Move image up */}
              <Image
                src={require("../../../figma exports/Right Side (1).png")}
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
