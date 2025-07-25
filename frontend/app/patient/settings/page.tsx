"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface SettingsData {
  account: {
    name: string;
    email: string;
    phone: string;
    timezone: string;
  };
  privacy: {
    visibility: string;
    dataSharing: string;
    analytics: boolean;
    thirdParty: boolean;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    reportUpdates: boolean;
    news: boolean;
  };
}

const PatientSettings = () => {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("/api/v1/patient/settings/")
      .then((res) => setSettings(res.data))
      .catch((err) => {
        console.error("Error fetching settings:", err);
        setError("Failed to load settings. Please try again.");
      });
  }, []);

  if (error) return <div className="text-red-600 p-4">{error}</div>;
  if (!settings) return <div className="p-4">Loading settings...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Account Section */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Account Settings</h2>
        <p><strong>Name:</strong> {settings.account.name}</p>
        <p><strong>Email:</strong> {settings.account.email}</p>
        <p><strong>Phone:</strong> {settings.account.phone}</p>
        <p><strong>Time zone:</strong> {settings.account.timezone}</p>
      </div>

      {/* Privacy Section */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Privacy Settings</h2>
        <p><strong>Profile Visibility:</strong> {settings.privacy.visibility}</p>
        <p><strong>Data Sharing:</strong> {settings.privacy.dataSharing}</p>
        <p><strong>Analytics:</strong> {settings.privacy.analytics ? "Enabled" : "Disabled"}</p>
        <p><strong>Third-party Access:</strong> {settings.privacy.thirdParty ? "Enabled" : "Disabled"}</p>
      </div>

      {/* Notification Section */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Notification Settings</h2>
        <p><strong>Email Notifications:</strong> {settings.notifications.email ? "Enabled" : "Disabled"}</p>
        <p><strong>SMS Notifications:</strong> {settings.notifications.sms ? "Enabled" : "Disabled"}</p>
        <p><strong>Report Updates:</strong> {settings.notifications.reportUpdates ? "Enabled" : "Disabled"}</p>
        <p><strong>News & Alerts:</strong> {settings.notifications.news ? "Enabled" : "Disabled"}</p>
      </div>

      <button className="px-4 py-2 bg-blue-600 text-white rounded">Save Changes</button>
    </div>
  );
};

export default PatientSettings;
