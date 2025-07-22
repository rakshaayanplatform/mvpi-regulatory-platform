"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";

export default function ProfilePage() {
  const [user, setUser] = useState({ name: "", email: "", role: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        // Optionally, check for auth token/localStorage here
        const res = await api.get("/profile/");
        setUser({
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
        });
        setLoading(false);
      } catch (err: any) {
        setError("Not logged in or failed to fetch profile.");
        setLoading(false);
        setTimeout(() => router.replace("/login"), 1500);
      }
    }
    fetchProfile();
  }, [router]);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Profile</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <Link href="/profile/update">Update Profile</Link><br/>
      <Link href="/change-password">Change Password</Link><br/>
      <Link href="/dashboard">Back to Dashboard</Link>
    </div>
  );
} 