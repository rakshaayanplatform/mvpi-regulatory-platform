"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Report {
  id: string;
  device: string;
  eventDate: string;
  status: string;
  lastUpdated: string;
}

export default function MyReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("/api/v1/patient/records/")
      .then((res) => setReports(res.data))
      .catch((err) => {
        console.error("Error fetching reports:", err);
        setError("Failed to load reports.");
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">My Reports</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-4 flex items-center gap-4">
        <input
          className="border border-gray-300 px-3 py-2 rounded w-1/2"
          placeholder="Search reports by device name, date, or status..."
        />
        <select className="border border-gray-300 px-3 py-2 rounded">
          <option>All</option>
          <option>Pending</option>
          <option>Under Review</option>
          <option>Completed</option>
          <option>Rejected</option>
        </select>
      </div>

      {reports.length > 0 ? (
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Report ID</th>
              <th className="border px-4 py-2">Device Name</th>
              <th className="border px-4 py-2">Event Date</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Last Updated</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id}>
                <td className="border px-4 py-2">{r.id}</td>
                <td className="border px-4 py-2">{r.device}</td>
                <td className="border px-4 py-2">{r.eventDate}</td>
                <td className="border px-4 py-2">{r.status}</td>
                <td className="border px-4 py-2">{r.lastUpdated}</td>
                <td className="border px-4 py-2">
                  <button className="text-blue-600 hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No reports available.</p>
      )}

      <div className="mt-4 text-sm text-gray-600">
        Showing 1-{reports.length} of {reports.length} reports
      </div>
      <div className="mt-2">Pagination here</div>
    </div>
  );
}
