"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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

    if (response.ok && data.verified) {
      setOtpVerified(true);
      setOtpSuccess("OTP verified successfully.");
    } else {
      setOtpError(data.error || data.message || "Invalid OTP.");
    }
  };

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
      // ✅ Store user_type in localStorage
      localStorage.setItem("user_type", user_type);
      
      alert("Registration successful!");
      router.push("/dashboard");
    } else {
      alert(data.message || "Registration failed");
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Full Name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="border p-2 w-full"
      />
      <input
        type="email"
        placeholder="Email ID"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border p-2 w-full"
      />
      <input
        type="text"
        placeholder="Mobile Number"
        value={phone_number}
        onChange={(e) => setPhone_number(e.target.value)}
        required
        className="border p-2 w-full"
      />

<select
  value={user_type}
  onChange={(e) => setUser_type(e.target.value)}
  className="border p-2 w-full"
  required
>
  <option value="">Select User Type</option>
  <option value="patient">Patient</option>
  <option value="hospital">Hospital Staff</option>
  <option value="manufacturer">Manufacturer</option>
  <option value="government_official">Government Official</option>
  <option value="coordinator">MDMC Coordinator</option>
  <option value="system_admin">System Administrator</option>
</select>


      <button
        type="button"
        onClick={handleSendOtp}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Send OTP
      </button>

      {otpSent && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp_code}
            onChange={(e) => setOtp_code(e.target.value)}
            className="border p-2 w-full"
          />
          <button
            type="button"
            onClick={handleVerifyOtp}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Verify OTP
          </button>
        </>
      )}

      {otpSuccess && <p className="text-green-600">{otpSuccess}</p>}
      {otpError && <p className="text-red-600">{otpError}</p>}

      {otp_code&& (
        <input
          type="password"
          placeholder="Set Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-2 w-full"
        />
      )}

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          required
        />
        <label>I accept the terms & conditions</label>
      </div>

      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded"
        disabled={!termsAccepted}
      >
        Register
      </button>
    </form>
  );
}