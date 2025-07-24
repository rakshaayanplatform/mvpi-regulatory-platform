"use client";
import { useEffect, useState } from "react";
import api from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";

interface Profile {
  username: string;
  email: string;
  phone_number: string;
  user_type: string;
}

const typeMap: Record<string, string> = {
  manufacturer: "Manufacturer",
  coordinator: "MDMC Coordinator",
  doctor: "Doctor",
  hospital: "Hospital Admin",
  patient: "Patient",
  government: "Government Official",
  admin: "System Administrator",
};

export default function ViewProfilePage() {
  const [profile, setProfile] = useState<Profile>({
    username: "",
    email: "",
    phone_number: "",
    user_type: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get("/profile/");
        setProfile({
          username: res.data.username,
          email: res.data.email,
          phone_number: res.data.phone_number,
          user_type: res.data.user_type,
        });
        setLoading(false);
      } catch (err: any) {
        setError(err?.response?.data?.detail || "Failed to load profile");
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (error) return <div className="text-red-600 text-center mt-8">{error}</div>;

  return (
    <div className="p-4 bg-white shadow rounded-md max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
      <p><strong>Name:</strong> {profile.username}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Phone Number:</strong> {profile.phone_number}</p>
      <p><strong>User Type:</strong> {typeMap[profile.user_type] || profile.user_type}</p>
      <button
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        onClick={() => router.push("/dashboard")}
      >
        Back to Dashboard
      </button>
    </div>
  );
}
