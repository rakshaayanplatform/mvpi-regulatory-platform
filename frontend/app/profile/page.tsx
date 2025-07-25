"use client";
import { useEffect, useState } from "react";
import axios from "axios";

// ✅ Type-safe profile interface
interface Profile {
  username: string;
  email: string;
  phone_number: string;
  user_type: string;
}

// ✅ User type map (flexible and avoids TS7053 error)
const typeMap: Record<string, string> = {
  manufacturer: "Manufacturer",
  coordinator: "MDMC Coordinator",
  doctor: "Doctor",
  hospital: "Hospital Admin",
  patient: "Patient",
  government: "Government Official",
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

  // ✅ Manually set your token here
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozMiwiZXhwIjoxNzUzMzYxNTk3LCJpYXQiOjE3NTMzNjA2OTd9.5DE_7wZRtm9PIWS0aZcvz0wovFz00AyO0e2k_av5Y9k";

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile({
          username: res.data.username,
          email: res.data.email,
          phone_number: res.data.phone_number,
          user_type: res.data.user_type,
        });

        setLoading(false);
      } catch (err) {
        setError("Failed to load profile");
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4 bg-white shadow rounded-md max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
      <p><strong>Name:</strong> {profile.username}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Phone Number:</strong> {profile.phone_number}</p>
      <p><strong>User Type:</strong> {typeMap[profile.user_type] || profile.user_type}</p>
    </div>
  );
}
