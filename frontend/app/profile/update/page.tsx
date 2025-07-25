"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";

export default function ProfileUpdatePage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization_name: "",
    designation: "",
    address: "",
    is_phone_verified: false,
    is_email_verified: false,
    user_type: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/`);
        const data = res.data;

        setForm({
          name: data.name || "",
          email: data.email || "",
          organization_name: data.organization_name ?? "",
          designation: data.designation ?? "",
          address: data.address ?? "",
          is_phone_verified: data.is_phone_verified ?? false,
          is_email_verified: data.is_email_verified ?? false,
          user_type: data.user_type || "",
        });
      } catch (err) {
        setError("Failed to fetch profile.");
      }
    }

    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target;
    const name = target.name;

    const value =
      target instanceof HTMLInputElement && target.type === "checkbox"
        ? target.checked
        : target.value;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/update/`, form);
      setSuccess("Profile updated successfully.");
      setTimeout(() => router.push("/profile"), 1500);
    } catch (err) {
      setError("Update failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Profile</h2>

        {success && <p className="text-green-600">{success}</p>}
        {error && <p className="text-red-600">{error}</p>}

        {/* Name */}
        <label className="block mb-2">
          Name:
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          />
        </label>

        {/* Email */}
        <label className="block mb-2">
          Email:
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          />
        </label>

        {/* Organization Name (only for manufacturer) */}
        {form.user_type === "manufacturer" && (
          <label className="block mb-2">
            Organization Name:
            <input
              name="organization_name"
              type="text"
              value={form.organization_name}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
            />
          </label>
        )}

        {/* Designation (only for hospital staff) */}
        {form.user_type === "hospital" && (
          <label className="block mb-2">
            Designation:
            <input
              name="designation"
              type="text"
              value={form.designation}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
            />
          </label>
        )}

        {/* Address */}
        <label className="block mb-2">
          Address:
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          />
        </label>

        {/* Readonly: Verification Status */}
        <div className="text-sm text-gray-600 mt-2">
          <p>📞 Phone Verified: {form.is_phone_verified ? "Yes" : "No"}</p>
          <p>📧 Email Verified: {form.is_email_verified ? "Yes" : "No"}</p>
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
