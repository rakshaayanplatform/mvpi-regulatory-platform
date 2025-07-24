"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";

const COUNTRY_CODES = [
  { code: "+91", label: "🇮🇳 +91" },
  { code: "+1", label: "🇺🇸 +1" },
  { code: "+44", label: "🇬🇧 +44" },
  { code: "+971", label: "🇦🇪 +971" },
  // Add more as needed
];

function formatPhoneNumber(countryCode: string, number: string) {
  const num = number.trim();
  if (!/^\d{10}$/.test(num)) {
    return null;
  }
  return countryCode + num;
}

export default function Signup() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0].code);
  const [phone_number, setPhone_number] = useState("");
  const [user_type, setUser_type] = useState("");
  const [otp_code, setOtp_code] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState("");
  const [otpError, setOtpError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<any>(null);

  const handleSendOtp = async () => {
    setOtpError("");
    setOtpSuccess("");
    const formattedPhone = formatPhoneNumber(countryCode, phone_number);
    if (!formattedPhone) {
      setOtpError("Please enter a valid 10-digit mobile number.");
      return;
    }
    try {
      await api.post("/request-otp/", { phone_number: formattedPhone });
      setOtpSent(true);
      setOtpSuccess("OTP sent successfully to your mobile.");
    } catch (error: any) {
      setOtpError(error?.response?.data?.error || error?.response?.data?.message || "Failed to send OTP.");
    }
  };

  const handleVerifyOtp = async () => {
    setOtpError("");
    setOtpSuccess("");
    const formattedPhone = formatPhoneNumber(countryCode, phone_number);
    if (!formattedPhone) {
      setOtpError("Please enter a valid 10-digit mobile number.");
      return;
    }
    try {
      const response = await api.post("/verify-otp/", { phone_number: formattedPhone, otp_code: otp_code.trim() });
      if (response.data.message?.includes("OTP verified")) {
        setOtpVerified(true);
        setOtpSuccess("OTP verified successfully.");
      } else {
        setOtpError("Invalid OTP.");
      }
    } catch (error: any) {
      setOtpError(error?.response?.data?.error || error?.response?.data?.message || "Invalid OTP.");
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setFormErrors(null);
    if (!otp_code) {
      setOtpError("Please verify OTP before submitting.");
      return;
    }
    const formattedPhone = formatPhoneNumber(countryCode, phone_number);
    if (!formattedPhone) {
      setOtpError("Please enter a valid 10-digit mobile number.");
      return;
    }
    try {
      await api.post("/register/", {
        username: username.trim(),
        email: email.trim(),
        phone_number: formattedPhone,
        user_type: user_type.trim(),
        password: password.trim(),
      });
      localStorage.setItem("user_type", user_type);
      setOtp_code("");
      setOtpError("");
      setFormErrors(null);
      alert("Registration successful!");
      router.push("/dashboard");
    } catch (error: any) {
      if (error?.response?.data) {
        setFormErrors(error.response.data);
      } else {
        setFormErrors({general: "Registration failed"});
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#CFFAFE] px-4">
      <div className="py-6 text-center">
        <span className="text-2xl font-bold text-blue-900">LOGO</span>
      </div>

      <div className="flex-grow">
        <form
          onSubmit={handleSubmit}
          className="max-w-xl w-full mx-auto bg-gradient-to-r from-gray-400/10 to-[#CFFAFE] border border-sky-300 rounded-md p-8 rounded-xl space-y-6"
        >
          <h2 className="text-xl font-bold text-blue-900 mb-2">Create Your Account</h2>

          <div className="mb-4">
            <p className="font-bold mb-2">I am</p>
            <div className="flex flex-wrap gap-2">
              {[
                "patient",
                "hospital",
                "manufacturer",
                "government_official",
                "coordinator",
                "system_admin",
              ].map((role, i) => {
                const icons = ["🧑", "🏥", "🏭", "🏛", "🧑‍💼", "🛠"];
                const labels = [
                  "Patient",
                  "Hospital Staff",
                  "Manufacturer",
                  "Gov. Official",
                  "Coordinator",
                  "Sys Admin",
                ];
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setUser_type(role)}
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${
                      user_type === role
                        ? "bg-blue-100 border-blue-500 text-blue-700"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {icons[i]} {labels[i]}
                  </button>
                );
              })}
            </div>
          </div>

          {[{
            label: "Full Name",
            value: username,
            setValue: setUsername,
            type: "text"
          }, {
            label: "Email ID",
            value: email,
            setValue: setEmail,
            type: "email"
          }].map((field) => (
            <div className="relative" key={field.label}>
              <label className="block relative cursor-text">
                <input
                  type={field.type}
                  value={field.value}
                  onChange={(e) => field.setValue(e.target.value)}
                  className="peer w-full border-b border-gray-400 bg-transparent py-4 placeholder-transparent focus:outline-none focus:border-blue-500"
                  placeholder={field.label}
                />
                <span className="absolute left-0 top-0 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-600">
                  {field.label}
                </span>
              </label>
            </div>
          ))}

          <div className="flex items-end gap-2 flex-wrap md:flex-nowrap">
            <div className="relative flex-grow">
              <label className="block relative cursor-text">
                <select value={countryCode} onChange={e => setCountryCode(e.target.value)} className="border-b border-gray-400 bg-transparent py-4 focus:outline-none focus:border-blue-500">
                  {COUNTRY_CODES.map(opt => <option key={opt.code} value={opt.code}>{opt.label}</option>)}
                </select>
                <input type="text" placeholder="Mobile Number" maxLength={10} value={phone_number} onChange={e => setPhone_number(e.target.value.replace(/\D/g, "").slice(0, 10))} className="peer w-full border-b border-gray-400 bg-transparent py-4 placeholder-transparent focus:outline-none focus:border-blue-500" />
              </label>
            </div>
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={otpSent}
              className="shrink-0 bg-lime-500 text-white px-4 py-2 rounded-full hover:bg-lime-600 text-sm mt-1"
            >
              {otpSent ? "OTP SENT" : "SEND OTP"}
            </button>
          </div>

          {otpSent && (
            <>
              <div className="flex items-end gap-2 flex-wrap md:flex-nowrap">
                <div className="relative flex-grow">
                  <label className="block relative cursor-text">
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      className="peer w-full border-b border-gray-400 bg-transparent py-4 placeholder-transparent focus:outline-none focus:border-blue-500"
                      value={otp_code}
                      onChange={(e) => setOtp_code(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    />
                    <span className="absolute left-0 top-0 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-600">
                      Enter 6-digit OTP
                    </span>
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={otpVerified}
                  className="shrink-0 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm mt-1"
                >
                  {otpVerified ? "✔ Verified" : "Verify OTP"}
                </button>
              </div>

              <div className="relative">
                <label className="block relative cursor-text">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="peer w-full border-b border-gray-400 bg-transparent py-4 placeholder-transparent focus:outline-none focus:border-blue-500 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span className="absolute left-0 top-0 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-600">
                    Password (min 6 characters)
                  </span>
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      // Eye open SVG
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                      </svg>
                    ) : (
                      // Eye closed SVG
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 002.25 12s3.75 7.5 9.75 7.5c1.956 0 3.74-.5 5.272-1.272M6.228 6.228A10.45 10.45 0 0112 4.5c6 0 9.75 7.5 9.75 7.5a17.896 17.896 0 01-3.478 4.752M6.228 6.228l11.544 11.544M6.228 6.228L3 3m15.75 15.75L21 21" />
                      </svg>
                    )}
                  </button>
                </label>
              </div>
            </>
          )}

          {otpError && <p className="text-red-500 text-sm mb-1">{otpError}</p>}
          {otpSuccess && <p className="text-green-600 text-sm mb-1">{otpSuccess}</p>}
          {formErrors && (
            <div className="text-red-600 text-sm mb-2">
              {typeof formErrors === "string"
                ? formErrors
                : Object.entries(formErrors).map(([field, msg]) => (
                    <div key={field}>{field}: {Array.isArray(msg) ? msg.join(", ") : String(msg)}</div>
                  ))}
            </div>
          )}

          <div className="flex justify-between items-center">
            <label className="flex gap-2 text-sm">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="accent-lime-500"
              />
              <span>
                I accept the <span className="text-blue-500 underline">Terms</span>
              </span>
            </label>
            <button
              type="submit"
              className={`py-2 px-6 rounded-full text-white font-semibold ${
                termsAccepted ? "bg-lime-500 hover:bg-lime-600" : "bg-gray-300 cursor-not-allowed"
              }`}
              disabled={!termsAccepted}
            >
              Register
            </button>
          </div>
        </form>
      </div>

      <footer className="text-center py-4 text-sm text-gray-600">
        © 2024 Rakshaayan. All rights reserved.
      </footer>
    </div>
  );
}
