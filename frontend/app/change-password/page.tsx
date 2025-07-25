"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import api from "@/utils/axiosInstance";

export default function ChangePasswordPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const response = await api.post("change-password/", form);

      console.log("✅ Password changed:", response.data);
      setSuccess("Password changed successfully!");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: any) {
      if (err.response) {
        const data = err.response.data;
        if (data.detail) {
          setError(data.detail);
        } else if (data.old_password) {
          setError(data.old_password[0]);
        } else if (data.new_password) {
          setError(data.new_password[0]);
        } else {
          setError("Something went wrong. Please check your input.");
        }
      } else {
        setError("No response from server. Check your network or token.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#CFFAFE] px-4">
      <div className="flex flex-1 items-center justify-center">
      <form
        onSubmit={handleSubmit}
          className="max-w-xl w-full mx-auto bg-blue-50 border-2 border-blue-200 shadow-lg rounded-xl p-6 md:p-8 space-y-6 animate-fade-in"
      >
          <h2 className="text-2xl font-bold text-blue-900 mb-2 text-center">Change Password</h2>

          {success && <p className="text-green-600 mb-2 text-center animate-fade-in">{success}</p>}
          {error && <p className="text-red-600 mb-2 text-center animate-fade-in">{error}</p>}

          <div className="space-y-4">
            <div className="relative">
          <input
                type={showOldPassword ? "text" : "password"}
            name="old_password"
            value={form.old_password}
            onChange={handleChange}
                className="peer w-full border-b border-gray-400 bg-transparent py-4 pr-10 placeholder-transparent focus:outline-none focus:border-blue-500 transition-all duration-200"
                placeholder="Old Password"
            required
            disabled={loading}
          />
              <span className="absolute left-0 top-0 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-600 pointer-events-none">
                Old Password
              </span>
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 focus:outline-none"
                onClick={() => setShowOldPassword((v) => !v)}
                aria-label={showOldPassword ? "Hide password" : "Show password"}
              >
                {showOldPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.236.938-4.675m1.675-2.675A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.336 3.236-.938 4.675m-1.675 2.675A9.956 9.956 0 0112 21c-1.657 0-3.236-.336-4.675-.938m-2.675-1.675A9.956 9.956 0 013 12c0-1.657.336-3.236.938-4.675m1.675-2.675A9.956 9.956 0 0112 3c1.657 0 3.236.336 4.675.938m2.675 1.675A9.956 9.956 0 0121 12c0 1.657-.336 3.236-.938 4.675m-1.675 2.675A9.956 9.956 0 0112 21z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.832-.64 1.624-1.09 2.357M15.54 15.54A9.956 9.956 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.236.938-4.675m1.675-2.675A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.336 3.236-.938 4.675m-1.675 2.675A9.956 9.956 0 0112 21c-1.657 0-3.236-.336-4.675-.938m-2.675-1.675A9.956 9.956 0 013 12z" /></svg>
                )}
              </button>
            </div>

            <div className="relative">
          <input
                type={showNewPassword ? "text" : "password"}
            name="new_password"
            value={form.new_password}
            onChange={handleChange}
                className="peer w-full border-b border-gray-400 bg-transparent py-4 pr-10 placeholder-transparent focus:outline-none focus:border-blue-500 transition-all duration-200"
                placeholder="New Password"
            required
            disabled={loading}
          />
              <span className="absolute left-0 top-0 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-600 pointer-events-none">
                New Password
              </span>
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 focus:outline-none"
                onClick={() => setShowNewPassword((v) => !v)}
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.236.938-4.675m1.675-2.675A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.336 3.236-.938 4.675m-1.675 2.675A9.956 9.956 0 0112 21c-1.657 0-3.236-.336-4.675-.938m-2.675-1.675A9.956 9.956 0 013 12c0-1.657.336-3.236.938-4.675m1.675-2.675A9.956 9.956 0 0112 3c1.657 0 3.236.336 4.675.938m2.675 1.675A9.956 9.956 0 0121 12c0 1.657-.336 3.236-.938 4.675m-1.675 2.675A9.956 9.956 0 0112 21c-1.657 0-3.236-.336-4.675-.938m-2.675-1.675A9.956 9.956 0 013 12z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.832-.64 1.624-1.09 2.357M15.54 15.54A9.956 9.956 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.236.938-4.675m1.675-2.675A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.336 3.236-.938 4.675m-1.675 2.675A9.956 9.956 0 0112 21c-1.657 0-3.236-.336-4.675-.938m-2.675-1.675A9.956 9.956 0 013 12z" /></svg>
                )}
              </button>
            </div>
          </div>

        <button
          type="submit"
            className="w-full bg-[#8ED100] hover:bg-lime-600 text-black font-bold py-2 rounded-full mt-4 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
        >
          Change Password
        </button>
      </form>
      </div>
      <footer className="text-center py-4 text-sm text-gray-600">
        © 2024 Rakshaayan. All rights reserved.
      </footer>
    </div>
  );
}
