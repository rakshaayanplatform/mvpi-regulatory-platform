"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// Define type for recent reports
type Report = {
  id: string;
  device: string;
  date: string;
  status: string;
};

export default function PatientDashboard() {
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const router = useRouter();

  useEffect(() => {
    axios
      .get("/api/v1/patient/records/")
      .then((res) => setRecentReports(res.data))
      .catch((err) => {
        console.error("Error fetching reports:", err);
        setRecentReports([]); // Remove fallback
      });
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 p-4 border-r">
        <h2 className="text-xl font-bold mb-6">Patient Menu</h2>
        <ul className="space-y-4 text-blue-700 font-medium">
          <li>
            <button onClick={() => router.push("/patient/dashboard")} className="hover:underline">
              Dashboard
            </button>
          </li>
          <li>
            <button onClick={() => router.push("/profile")} className="hover:underline">
              Profile
            </button>
          </li>
          <li>
            <button onClick={() => router.push("/patient/report-adverse-event")} className="hover:underline">
              Report Event
            </button>
          </li>
          <li>
            <button onClick={() => router.push("/patient/my-reports")} className="hover:underline">
              My Reports
            </button>
          </li>
          <li>
            <button onClick={() => router.push("/patient/settings")} className="hover:underline">
              Settings
            </button>
          </li>
          <li>
            <button onClick={() => router.push("/patient/report-status")} className="hover:underline">
              Report Status
            </button>
          </li>
          <li>
            <button onClick={() => router.push("/patient/help")} className="hover:underline">
              Help
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Patient Dashboard</h1>

        <h2 className="text-lg font-semibold mb-4">Recent Reports</h2>
        <div className="space-y-3">
          {recentReports.length === 0 ? (
            <p>No reports available.</p>
          ) : (
            recentReports.map((report) => (
              <div
                key={report.id}
                className="border rounded-lg p-4 shadow-sm bg-white"
              >
                <div><strong>Report ID:</strong> {report.id}</div>
                <div><strong>Device:</strong> {report.device}</div>
                <div><strong>Date:</strong> {report.date}</div>
                <div><strong>Status:</strong> {report.status}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
