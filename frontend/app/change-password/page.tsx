"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ChangePasswordPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
  });

  const [token, setToken] = useState(""); // Manually entered token
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token.trim()) {
      setError("Please enter a valid Bearer token.");
      return;
    }

    try {
      const response = await axios.post(
        "http://100.97.106.2:8001/change-password/",
        form,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo3LCJleHAiOjE3NTMyNzYwNjEsImlhdCI6MTc1MzI3NTE2MX0.FQWr6OAYhbqQYRgStv5mws2_Q9ZT-4Lr5r2AzRhZM-E`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Password changed:", response.data);
      setSuccess("Password changed successfully!");
      setTimeout(() => router.push("/profile"), 2000);
    } catch (err: any) {
      console.error("Password change failed:", err);
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.response?.data?.old_password) {
        setError(err.response.data.old_password[0]);
      } else {
        setError("Failed to change password. Please try again.");
      }
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

        <label className="block mb-4">
          Bearer Token:
          <input
            type="text"
            name="token"
            value={token}
            onChange={handleTokenChange}
            className="w-full mt-1 p-2 border rounded"
            required
          />
        </label>

        <label className="block mb-4">
          Old Password:
          <input
            type="password"
            name="old_password"
            value={form.old_password}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
            required
          />
        </label>

        <label className="block mb-4">
          New Password:
          <input
            type="password"
            name="new_password"
            value={form.new_password}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
            required
          />
        </label>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full"
        >
          Change Password
        </button>
      </form>
    </div>
  );
}
