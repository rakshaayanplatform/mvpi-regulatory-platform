"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/utils/axiosInstance";

export default function UpdateProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get("/profile/");
        setForm({ name: res.data.name, email: res.data.email });
        setLoading(false);
      } catch (err) {
        setError("Failed to load profile");
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/profile/update/", form);
      router.push("/profile");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to update profile");
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Update Profile</h2>
      <input
        placeholder="Name"
        name="name"
        value={form.name}
        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
      /><br/>
      <input
        placeholder="Email"
        name="email"
        value={form.email}
        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
      /><br/>
      <button type="submit">Update</button>
    </form>
  );
} 