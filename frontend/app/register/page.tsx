"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';


export default function Signup() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [user_type, setUser_type] = useState("");
  const [otp_code, setOtp_code] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState("");
  const [otpError, setOtpError] = useState("");

  const handleSendOtp = async () => {
    setOtpError("");
    setOtpSuccess("");

    const response = await fetch("http://100.97.106.2:8001/request-otp/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone_number }),
    });

    const data = await response.json();

    if (response.ok) {
      setOtpSent(true);
      setOtpSuccess("OTP sent successfully to your mobile.");
    } else {
      setOtpError(data.error || data.message || "Failed to send OTP.");
    }
  };

 const handleVerifyOtp = async () => {
  setOtpError("");
  setOtpSuccess("");

  const response = await fetch("http://100.97.106.2:8001/verify-otp/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone_number, otp_code }),
  });

  const data = await response.json();

  if (response.ok && data.message?.toLowerCase().includes("otp verified")) {
    setOtpVerified(true);
    setOtpSuccess(data.message || "OTP verified successfully.");
  } else {
    setOtpError(data.error || data.message || "Invalid OTP.");
  }
};

const canRegister =
  username.trim() !== "" &&
  email.trim() !== "" &&
  phone_number.trim() !== "" &&
  user_type.trim() !== "" &&
  otpVerified &&
  password.trim() !== "" &&
  termsAccepted;



  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!otp_code) {
      setOtpError("Please verify OTP before submitting.");
      return;
    }

    const response = await fetch("http://100.97.106.2:8001/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        email,
        phone_number,
        user_type,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("user_type", user_type);
      alert("Registration successful!");
      router.push("/dashboard");
    } else {
      alert(data.message || "Registration failed");
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
                
              ].map((role, i) => {
                const icons = ["🧑", "🏥", "🏭", "🏛", "🧑‍💼"];
                const labels = [
                  "Patient",
                  "Hospital Staff",
                  "Manufacturer",
                  "Gov. Official",
                  "Coordinator",
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
           <div className="flex items-end gap-2 flex-wrap md:flex-nowrap">
  <div className="relative flex-grow">
    <label className="block mb-1 text-sm text-gray-500">Mobile Number</label>
    <PhoneInput
      country={'in'}
      value={phone_number}
      onChange={(phone) => setPhone_number(phone)}
      inputClass="!bg-transparent !border-b !border-gray-400 !w-full !py-4 !focus:outline-none !focus:border-blue-500"
      containerClass="!w-full"
    />
  </div>
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
      type="password"
      placeholder="Password"
      className="peer w-full border-b border-gray-400 bg-transparent py-4 placeholder-transparent focus:outline-none focus:border-blue-500"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    <span className="absolute left-0 top-0 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-600">
      Password
    </span>
  </label>

  {/* Validation Messages */}
  {password && (
    <div className="mt-2 text-sm text-red-500 space-y-1">
      {!/^.{8,}$/.test(password) && <p>• At least 8 characters</p>}
      {!/[A-Z]/.test(password) && <p>• At least one uppercase letter</p>}
      {!/[a-z]/.test(password) && <p>• At least one lowercase letter</p>}
      {!/[0-9]/.test(password) && <p>• At least one digit</p>}
      {!/[^A-Za-z0-9]/.test(password) && <p>• At least one special character</p>}
    </div>
  )}
</div>

            </>
          )}

          {otpError && <p className="text-red-500 text-sm mb-1">{otpError}</p>}
          {otpSuccess && <p className="text-green-600 text-sm mb-1">{otpSuccess}</p>}

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
    canRegister ? "bg-lime-500 hover:bg-lime-600" : "bg-gray-300 cursor-not-allowed"
  }`}
  disabled={!canRegister}
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
