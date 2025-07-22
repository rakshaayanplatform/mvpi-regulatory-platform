"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";

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
    try {
      const response = await api.post("/change-password", form);
      console.log("Password changed:", response.data);
      setSuccess("Password changed successfully.");
      setTimeout(() => router.push("/profile"), 1500);
    } catch (err: any) {
      console.error("Password change failed:", err);
      setError("Failed to change password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
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
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Change Password
        </button>
      </form>
    </div>
  );
}
