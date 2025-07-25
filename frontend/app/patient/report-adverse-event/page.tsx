"use client";
import React, { useState } from "react";
import axios from "axios";

const ReportAdverseEvent = () => {
  const [form, setForm] = useState({
    patientName: "",
    age: "",
    gender: "",
    contact: "",
    email: "",
    deviceName: "",
    manufacturer: "",
    modelNumber: "",
    serialNumber: "",
    dateOfUse: "",
    eventDate: "",
    eventTime: "",
    eventLocation: "",
    eventDescription: "",
    severity: "",
    outcome: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    axios
      .post("/api/v1/patient/records/", form)
      .then(() => {
        setMessage("Report submitted successfully!");
        setForm({
          patientName: "",
          age: "",
          gender: "",
          contact: "",
          email: "",
          deviceName: "",
          manufacturer: "",
          modelNumber: "",
          serialNumber: "",
          dateOfUse: "",
          eventDate: "",
          eventTime: "",
          eventLocation: "",
          eventDescription: "",
          severity: "",
          outcome: "",
        });
      })
      .catch(() => {
        setMessage("Failed to submit report.");
      });
  };

  const handleCancel = () => {
    setForm({
      patientName: "",
      age: "",
      gender: "",
      contact: "",
      email: "",
      deviceName: "",
      manufacturer: "",
      modelNumber: "",
      serialNumber: "",
      dateOfUse: "",
      eventDate: "",
      eventTime: "",
      eventLocation: "",
      eventDescription: "",
      severity: "",
      outcome: "",
    });
    setMessage("");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Report Adverse Event</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="font-semibold text-lg">Patient Information</h2>
        <input name="patientName" placeholder="Patient Name" value={form.patientName} onChange={handleChange} />
        <input name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} />
        <input name="gender" placeholder="Gender" value={form.gender} onChange={handleChange} />
        <input name="contact" type="tel" placeholder="Contact Number" value={form.contact} onChange={handleChange} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />

        <h2 className="font-semibold text-lg">Device Information</h2>
        <input name="deviceName" placeholder="Device Name" value={form.deviceName} onChange={handleChange} />
        <input name="manufacturer" placeholder="Manufacturer" value={form.manufacturer} onChange={handleChange} />
        <input name="modelNumber" placeholder="Model Number" value={form.modelNumber} onChange={handleChange} />
        <input name="serialNumber" placeholder="Serial Number" value={form.serialNumber} onChange={handleChange} />
        <input name="dateOfUse" type="date" placeholder="Date of Use" value={form.dateOfUse} onChange={handleChange} />

        <h2 className="font-semibold text-lg">Event Details</h2>
        <input name="eventDate" type="date" placeholder="Event Date" value={form.eventDate} onChange={handleChange} />
        <input name="eventTime" type="time" placeholder="Event Time" value={form.eventTime} onChange={handleChange} />
        <input name="eventLocation" placeholder="Event Location" value={form.eventLocation} onChange={handleChange} />
        <textarea name="eventDescription" placeholder="Event Description" value={form.eventDescription} onChange={handleChange} />
        <input name="severity" placeholder="Severity" value={form.severity} onChange={handleChange} />
        <input name="outcome" placeholder="Outcome" value={form.outcome} onChange={handleChange} />

        <div className="flex gap-4 mt-4">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Submit Report</button>
          <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-300 text-black rounded">Cancel</button>
        </div>
      </form>

      {message && <div className="mt-4 text-green-600">{message}</div>}
    </div>
  );
};

export default ReportAdverseEvent;
