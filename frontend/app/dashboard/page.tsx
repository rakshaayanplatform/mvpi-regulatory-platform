"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [role, setRole] = useState("patient");

  useEffect(() => {
    const r = localStorage.getItem("userRole") || "patient";
    setRole(r);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Welcome to the Dashboard, {role}!
        </h2>

        <div className="flex flex-col gap-4">
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

          <Link
            href="/logout"
            className="bg-red-500 hover:bg-red-600 text-white py-2 rounded"
          >
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
}
