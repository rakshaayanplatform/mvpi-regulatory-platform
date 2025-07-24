"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";

export default function ProfileUpdatePage() {
  const [form, setForm] = useState({ username: "", email: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get("/profile/");
        setForm({ username: res.data.username, email: res.data.email });
      } catch (err: any) {
        setError(err?.response?.data?.detail || "Failed to fetch profile.");
      } finally {
        setInitialLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await api.put("/profile/update/", form);
      setSuccess("Profile updated successfully.");
      setTimeout(() => router.push("/profile"), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

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
          Username:
          <input
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
            disabled={loading}
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
            disabled={loading}
          />
        </label>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex-1 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? <span className="animate-spin inline-block w-5 h-5 border-b-2 border-white rounded-full"></span> : "Save Changes"}
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
