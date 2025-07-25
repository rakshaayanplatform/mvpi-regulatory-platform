"use client";
import { useEffect, useState } from "react";
import api from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";


interface Profile {
  [key: string]: any;
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
  const [profile, setProfile] = useState<Profile>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get("profile/");
        setProfile(res.data);
        setLoading(false);
      } catch (err: any) {
        setError(err?.response?.data?.detail || "Failed to load profile");
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Get initials for avatar
  let initials = "?";
  if (profile.first_name && profile.last_name) {
    initials = profile.first_name.charAt(0).toUpperCase() + profile.last_name.charAt(0).toUpperCase();
  } else if (profile.first_name) {
    initials = profile.first_name.charAt(0).toUpperCase();
  } else if (profile.name) {
    const parts = profile.name.split(" ");
    if (parts.length > 1) {
      initials = parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase();
    } else {
      initials = parts[0].charAt(0).toUpperCase();
    }
  }
  const seen = new Set<string>();
  const displayFields = Object.keys(profile).filter((key) => {
    if (["id", "is_superuser", "is_staff", "is_active", "email_verification_token", "groups", "user_permissions", "password"].includes(key)) return false;
    if (["username", "name"].includes(key) && (profile.first_name || profile.last_name)) return false;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const readOnlyFields = ["user_type", "last_login", "date_joined"];

  return (
    <div className="min-h-screen flex flex-col bg-[#CFFAFE] px-4">
      {/* Header with logo and back button */}
      <header className="flex items-center justify-between py-4 max-w-xl w-full mx-auto">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-blue-700 hover:text-blue-900 font-semibold px-3 py-1 rounded transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
        <div className="flex items-center gap-2">
          <img src="/favicon.ico" alt="Logo" className="h-8 w-8 rounded" />
          <span className="text-xl font-bold text-blue-900">Rakshaayan</span>
        </div>
        <div className="w-16" /> {/* Spacer for symmetry */}
      </header>
      <main className="flex flex-1 flex-col justify-center items-center">
        <div className="relative max-w-xl w-full mx-auto bg-blue-50 border-2 border-blue-200 shadow-lg rounded-xl p-8 md:p-10 animate-fade-in mt-4 mb-8">
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg animate-pop-in">
              {initials}
            </div>
          </div>
          <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Your Profile</h2>
          <div className="space-y-4">
            {displayFields.map((key) => (
              <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <span className="w-36 text-gray-600 font-semibold capitalize">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</span>
                <span className={`flex-1 text-gray-900 ${readOnlyFields.includes(key) ? 'opacity-70' : ''}`}>{profile[key]}</span>
              </div>
            ))}
          </div>
          {/* Edit button */}
          <button
            onClick={() => router.push("/profile/update")}
            className="absolute bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center border-2 border-blue-600 animate-fade-in"
            title="Edit Profile"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h6" /></svg>
          </button>
        </div>
      </main>
      <footer className="text-center py-4 text-sm text-gray-600 w-full max-w-xl mx-auto">
        © 2024 Rakshaayan. All rights reserved.
      </footer>
    </div>
  );
}
