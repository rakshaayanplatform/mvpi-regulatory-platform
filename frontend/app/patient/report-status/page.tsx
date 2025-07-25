"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface TimelineItem {
  step: string;
  date: string;
  status: "completed" | "current" | "pending";
}

interface StatusData {
  id: string;
  timeline: TimelineItem[];
  details: {
    device: string;
    eventDate: string;
    location: string;
    description: string;
    severity: string;
    currentStatus: string;
  };
  caseManager: {
    name: string;
    email: string;
    phone: string;
    estimatedResolution: string;
  };
}

export default function ReportStatus() {
  const [status, setStatus] = useState<StatusData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("/api/v1/patient/records/status/")
      .then((res) => setStatus(res.data))
      .catch((err) => {
        console.error("Error fetching status:", err);
        setError("Failed to fetch report status.");
      });
  }, []);

  if (error) return <div className="text-red-600 p-4">{error}</div>;
  if (!status) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Report Status</h1>

      <div>
        <h2 className="text-lg font-semibold mb-2">Status Timeline</h2>
        <ul className="space-y-1 list-disc list-inside">
          {status.timeline.map((item, idx) => (
            <li key={idx}>
              <strong>{item.step}</strong> – {item.date}{" "}
              <span className="text-sm text-gray-600">({item.status})</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Report Details</h2>
        <p><strong>Device:</strong> {status.details.device}</p>
        <p><strong>Event Date:</strong> {status.details.eventDate}</p>
        <p><strong>Location:</strong> {status.details.location}</p>
        <p><strong>Description:</strong> {status.details.description}</p>
        <p><strong>Severity:</strong> {status.details.severity}</p>
        <p><strong>Current Status:</strong> {status.details.currentStatus}</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Case Manager Contact</h2>
        <p><strong>Name:</strong> {status.caseManager.name}</p>
        <p><strong>Email:</strong> {status.caseManager.email}</p>
        <p><strong>Phone:</strong> {status.caseManager.phone}</p>
        <p><strong>Estimated Resolution:</strong> {status.caseManager.estimatedResolution}</p>
      </div>
    </div>
  );
}
