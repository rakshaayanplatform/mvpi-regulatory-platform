"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";

export default function ProfileUpdatePage() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get("/profile/");
        setForm({ name: res.data.name, email: res.data.email });
      } catch (err) {
        setError("Failed to fetch profile.");
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await api.post("/profile/update/", form);
      setSuccess("Profile updated successfully.");
      setTimeout(() => router.push("/profile"), 1500);
    } catch (err) {
      setError("Update failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Profile</h2>

        {success && <p className="text-green-600">{success}</p>}
        {error && <p className="text-red-600">{error}</p>}

        <label className="block mb-2">
          Name:
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          />
        </label>

        <label className="block mb-4">
          Email:
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          />
        </label>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
