"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ChangePasswordPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://100.97.106.2:8001/change-password/",
        form,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo3LCJleHAiOjE3NTMzMzI4NjUsImlhdCI6MTc1MzMzMTk2NX0.8Jf-S5fN38XHEVGGkcSiv2urbrzY3DKU4uLf5SidilA`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Password changed:", response.data);
      setSuccess("Password changed successfully!");

      setTimeout(() => {
        router.push("/profile");
      }, 2000);
    } catch (err: any) {
      console.error("❌ Password change failed:", err);

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
