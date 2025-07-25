"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
      const response = await fetch("http://100.97.106.2:8001/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      console.log("Login response status:", response.status);

      const data = await response.json();
      console.log("Login response data:", data);

      if (response.ok) {
        localStorage.setItem("userRole", data.role || "patient");
        localStorage.setItem("userName", data.name || username);
        localStorage.setItem("userEmail", data.email || "");
        router.push("/dashboard");
      } else {
        setError(data.detail || "Invalid username or password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to connect to backend.");
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
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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