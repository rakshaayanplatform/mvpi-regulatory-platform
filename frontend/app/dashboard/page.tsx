"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardPage() {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      alert("Refresh token missing. Cannot logout.");
      return;
    }

    try {
      await axios.post("http://100.97.106.2:8001/logout/", {
        refresh: refreshToken,
      });

      // Clear local storage
      localStorage.removeItem("userRole");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed. Try again.");
    }
  };

  const renderDashboardContent = () => {
    switch (role) {
      case "manufacturer":
        return (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Welcome Manufacturer!
            </h2>
            <Link href="/manufacturer/devices" className="btn">
              Manage Devices
            </Link>
          </>
        );
      case "doctor":
        return (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Welcome Doctor!
            </h2>
            <Link href="/doctor/reports" className="btn">
              View Reports
            </Link>
          </>
        );
      case "hospital":
        return (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Welcome Hospital Admin!
            </h2>
            <Link href="/hospital/staff" className="btn">
              Manage Staff
            </Link>
          </>
        );
      case "patient":
        return (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Welcome Patient!
            </h2>
            <Link href="/patient/records" className="btn">
              View Health Records
            </Link>
          </>
        );
      default:
        return (
          <h2 className="text-2xl font-bold text-red-600">Invalid role!</h2>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md text-center">
        {role ? renderDashboardContent() : <p className="text-gray-500">Loading...</p>}

        {role && (
          <div className="flex flex-col gap-4 mt-6">
            <Link
              href="/profile"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
            >
              View / Update Profile
            </Link>

            <Link
              href="/change-password"
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
            >
              Change Password
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white py-2 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
