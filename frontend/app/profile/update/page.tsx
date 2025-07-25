"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";

export default function ProfileUpdatePage() {
  const [form, setForm] = useState<any>({});
  const [allFields, setAllFields] = useState<string[]>([]);
  const [profileMeta, setProfileMeta] = useState<{[key: string]: any}>({});

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [validationErrors, setValidationErrors] = useState<any>({});
  const [showEmailVerifyPopup, setShowEmailVerifyPopup] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [emailChanged, setEmailChanged] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get("profile/");
        const data = res.data;
        setForm(data);
        setAllFields(Object.keys(data));
        setProfileMeta({
          is_phone_verified: data.is_phone_verified,
          is_email_verified: data.is_email_verified,
          created_at: data.created_at,
          updated_at: data.updated_at,
        });
      } catch (err) {
        setError("Failed to fetch profile.");
      }
    }
    fetchProfile();
  }, []);

  const validateField = (name: string, value: string) => {
    // Prevent consecutive numbers
    if (/\d{3,}/.test(value)) {
      return "No 3+ consecutive numbers allowed.";
    }
    // Prevent 3+ repeated letters
    if (/(.)\1{2,}/.test(value)) {
      return "No 3+ repeated letters allowed.";
    }
    // Prevent only dots/dashes/spaces
    if (/^[.\-\s]+$/.test(value)) {
      return "Cannot be only dots, dashes, or spaces.";
    }
    // Prevent empty or whitespace
    if (!value.trim()) {
      return "Cannot be empty.";
    }
    return "";
  };

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
    // Validate on change
    if (["name", "organization_name", "designation", "address"].includes(name) && typeof value === 'string') {
      setValidationErrors((prev: any) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  const handleUpdateEmailClick = () => {
    setPendingEmail(form.email);
    setShowEmailVerifyPopup(true);
    setEmailChanged(true);
  };

  const isFormValid = () => {
    // Validate all relevant fields
    const fields = [
      { key: "name", value: form.name },
      { key: "organization_name", value: form.organization_name },
      { key: "designation", value: form.designation },
      { key: "address", value: form.address },
    ];
    let valid = true;
    const errors: any = {};
    fields.forEach(({ key, value }) => {
      if ((key === "organization_name" && form.user_type !== "manufacturer") ||
          (key === "designation" && form.user_type !== "hospital")) {
        return;
      }
      if (typeof value === 'string') {
        const err = validateField(key, value);
        if (err) {
          valid = false;
          errors[key] = err;
        }
      }
    });
    setValidationErrors(errors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;
    try {
      await api.put("profile/update/", form);
      setSuccess("Profile updated successfully.");
      setTimeout(() => router.push("/profile"), 1500);
    } catch (err) {
      setError("Update failed. Please try again.");
    }
  };

  const handleEmailVerify = async () => {
    // Call backend to send verification email
    try {
      await api.post("email/send-verification/", {});
      alert("Verification email sent. Please check your inbox.");
      setShowEmailVerifyPopup(false);
      // Optionally, you can block update until email is verified
    } catch (err) {
      alert("Failed to send verification email. Try again.");
    }
  };

  const handleCheckVerification = async () => {
    try {
      const res = await api.get("profile/");
      const data = res.data;
      setForm((prev: any) => ({ ...prev, email: data.email }));
      setProfileMeta((prev: any) => ({
        ...prev,
        is_email_verified: data.is_email_verified,
      }));
      if (data.is_email_verified) {
        setShowEmailVerifyPopup(false);
        setSuccess("Email verified successfully!");
      }
    } catch (err) {
      alert("Failed to check verification status.");
    }
  };

  const hiddenFields = [
    "id", "is_superuser", "is_staff", "is_active", "email_verification_token", "groups", "user_permissions"
  ];
  // Add created_at and updated_at to readOnlyFields
  const readOnlyFields = [
    "user_type", "last_login", "date_joined", "created_at", "updated_at", "is_phone_verified", "is_email_verified"
  ];

  // Store initial form state for change detection
  const [initialForm, setInitialForm] = useState<any>(null);
  useEffect(() => {
    if (Object.keys(form).length && !initialForm) {
      setInitialForm(form);
    }
  }, [form, initialForm]);

  // Only show each field once (no duplicates)
  const seen = new Set<string>();
  const editableFields = allFields.filter((key) => {
    if (["id", "is_superuser", "is_staff", "is_active", "email_verification_token", "groups", "user_permissions", "password"].includes(key)) return false;
    if (["username", "name"].includes(key) && (form.first_name || form.last_name)) return false;
    if (readOnlyFields.includes(key)) return false;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const readonlyDisplayFields = allFields.filter((key) => readOnlyFields.includes(key) && form[key] !== undefined && form[key] !== null && form[key] !== "");

  // Detect if any editable field has changed
  const hasChanges = initialForm && editableFields.some((key) => form[key] !== initialForm[key]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#CFFAFE] px-4">
      <div className="flex flex-1 items-center justify-center">
      <form
        onSubmit={handleSubmit}
          className="max-w-xl w-full mx-auto bg-blue-50 border-2 border-blue-200 shadow-lg rounded-xl p-6 md:p-8 space-y-6 animate-fade-in"
        >
          {/* Back arrow or Cancel button at the top */}
          <div className="flex items-center mb-6">
            <button
              type="button"
              onClick={() => router.push("/profile")}
              className="flex items-center text-blue-600 hover:text-blue-800 font-semibold text-base focus:outline-none"
              aria-label="Back to Profile"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Back
            </button>
          </div>
          <h2 className="text-2xl font-bold text-blue-900 mb-2 text-center">Update Profile</h2>

          {success && <p className="text-green-600 mb-2 text-center animate-fade-in">{success}</p>}
          {error && <p className="text-red-600 mb-2 text-center animate-fade-in">{error}</p>}

          <div className="space-y-4">
            {/* Editable fields at the top */}
            {editableFields.map((field) => (
              <div key={field} className="relative flex items-center gap-2">
                {field === "address" ? (
                  <textarea
                    name={field}
                    value={form[field] ?? ''}
            onChange={handleChange}
                    className="peer w-full border-b border-gray-400 bg-transparent py-4 placeholder-transparent focus:outline-none focus:border-blue-500 transition-all duration-200 resize-none min-h-[48px]"
                    placeholder={field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  />
                ) : field === "email" ? (
                  <>
          <input
                      name={field}
            type="email"
                      value={form[field] ?? ''}
            onChange={handleChange}
                      className="peer w-full border-b border-gray-400 bg-transparent py-4 placeholder-transparent focus:outline-none focus:border-blue-500 transition-all duration-200"
                      placeholder={field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      required
                    />
                    <button
                      type="button"
                      onClick={handleUpdateEmailClick}
                      className="ml-2 px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-semibold shadow hover:bg-blue-700 transition-all border border-blue-600"
                    >
                      Update Email
                    </button>
                  </>
                ) : (
            <input
                    name={field}
              type="text"
                    value={form[field] ?? ''}
              onChange={handleChange}
                    className="peer w-full border-b border-gray-400 bg-transparent py-4 placeholder-transparent focus:outline-none focus:border-blue-500 transition-all duration-200"
                    placeholder={field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    required={field === "username"}
                  />
                )}
                <span className="absolute left-0 top-0 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-600 pointer-events-none">
                  {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
                {validationErrors[field] && (
                  <span className="text-xs text-red-500 absolute left-0 -bottom-5 animate-fade-in">{validationErrors[field]}</span>
                )}
              </div>
            ))}
            {/* Read-only fields at the end */}
            {readonlyDisplayFields.map((field) => (
              <div key={field} className="relative">
            <input
                  name={field}
              type="text"
                  value={form[field] ?? ''}
                  readOnly
                  className="peer w-full border-b border-gray-400 bg-transparent py-4 text-gray-500 cursor-not-allowed placeholder-transparent focus:outline-none focus:border-blue-500 transition-all duration-200"
                  placeholder={field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                />
                <span className="absolute left-0 top-0 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-600 pointer-events-none">
                  {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>
            ))}
        </div>



        {hasChanges && (
        <button
          type="submit"
            className={`w-full bg-[#8ED100] hover:bg-lime-600 text-black font-bold py-2 rounded-full mt-4 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-lime-400 ${Object.values(validationErrors).some((err) => err) ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={Object.values(validationErrors).some((err) => err)}
        >
          Save Changes
        </button>
        )}
      </form>
      </div>
      {/* Email Verification Popup */}
      {showEmailVerifyPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.15)'}}>
          <div className="bg-white bg-opacity-90 rounded-xl shadow-2xl p-8 max-w-xs w-full text-center border-2 border-blue-600" style={{backdropFilter: 'none'}}>
            <h3 className="text-lg font-semibold mb-4 text-blue-800">Verify your new email address</h3>
            <p className="mb-4 text-gray-700">A verification email will be sent to <span className="font-bold">{pendingEmail}</span>. Please verify before updating your profile.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold border border-blue-600"
                onClick={handleEmailVerify}
              >
                Send Verification Email
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded font-semibold border border-blue-600"
                onClick={() => setShowEmailVerifyPopup(false)}
              >
                Cancel
              </button>
            </div>
            <button
              className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold border border-green-600"
              onClick={handleCheckVerification}
            >
              Check Verification Status
            </button>
          </div>
        </div>
      )}
      <footer className="text-center py-4 text-sm text-gray-600">
        © 2024 Rakshaayan. All rights reserved.
      </footer>
    </div>
  );
}
