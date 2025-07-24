"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";

export default function ChangePasswordPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
  });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
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
      await api.post("/change-password/", form);
      setSuccess("Password changed successfully!");
      setTimeout(() => {
        router.push("/profile");
      }, 2000);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Change Password</h2>

        {success && <p className="text-green-600 mb-2">{success}</p>}
        {error && <p className="text-red-600 mb-2">{error}</p>}

        <label className="block mb-4 relative">
          Old Password:
          <input
            type={showOld ? "text" : "password"}
            name="old_password"
            value={form.old_password}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded pr-10"
            required
            disabled={loading}
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-2 top-9 text-gray-500 hover:text-gray-700"
            onClick={() => setShowOld((v) => !v)}
            aria-label={showOld ? "Hide old password" : "Show old password"}
          >
            {showOld ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 002.25 12s3.75 7.5 9.75 7.5c1.956 0 3.74-.5 5.272-1.272M6.228 6.228A10.45 10.45 0 0112 4.5c6 0 9.75 7.5 9.75 7.5a17.896 17.896 0 01-3.478 4.752M6.228 6.228l11.544 11.544M6.228 6.228L3 3m15.75 15.75L21 21" />
              </svg>
            )}
          </button>
        </label>

        <label className="block mb-4 relative">
          New Password:
          <input
            type={showNew ? "text" : "password"}
            name="new_password"
            value={form.new_password}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded pr-10"
            required
            disabled={loading}
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-2 top-9 text-gray-500 hover:text-gray-700"
            onClick={() => setShowNew((v) => !v)}
            aria-label={showNew ? "Hide new password" : "Show new password"}
          >
            {showNew ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 002.25 12s3.75 7.5 9.75 7.5c1.956 0 3.74-.5 5.272-1.272M6.228 6.228A10.45 10.45 0 0112 4.5c6 0 9.75 7.5 9.75 7.5a17.896 17.896 0 01-3.478 4.752M6.228 6.228l11.544 11.544M6.228 6.228L3 3m15.75 15.75L21 21" />
              </svg>
            )}
          </button>
        </label>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex-1 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? <span className="animate-spin inline-block w-5 h-5 border-b-2 border-white rounded-full"></span> : "Change Password"}
          </button>
          <button
            type="button"
            className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded flex-1"
            onClick={() => router.push("/profile")}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
