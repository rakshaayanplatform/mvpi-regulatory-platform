"use client";
import { SetStateAction, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
// Adjust these imports as needed for your project structure
// import Nav from "@/components/register/nav";
// import Footer from "../../components/footer";
// import Logo from "@/components/logo";
// import { registerUser } from "@/src/lib/api";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [buttonText, setButtonText] = useState("SEND OTP");
  const [selectedDate, setSelectedDate] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState('');
  const router = useRouter();

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState("");

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

  useEffect(() => {
    setIsFormValid(
      name.trim() !== "" &&
        gender !== "" &&
        password.length >= 6 &&
        email.includes("@") &&
        mobileNumber.length === 10 &&
        otp.length === 6 &&
        selectedDate !== "" &&
        termsAccepted &&
        isOtpVerified
    );
  }, [
    name,
    gender,
    password,
    email,
    mobileNumber,
    otp,
    selectedDate,
    termsAccepted,
    isOtpVerified,
  ]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fullName = e.target.value;
    if (fullName.length > 100) return;
    setName(fullName);

    const nameParts = fullName.trim().split(/\s+/);
    const extractedFirst = nameParts[0] || "";
    let extractedLast = nameParts.slice(1).join(" ") || "";

    if (extractedLast.length >= 50) {
      extractedLast = extractedLast.slice(0, 49);
    }

    setFirstName(extractedFirst);
    setLastName(extractedLast);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === "email") {
      setEmail(value);
    } else if (id === "mobileNumber") {
      setMobileNumber(value.replace(/\D/g, "").slice(0, 10));
      setShowOtpInput(false);
      setOtp("");
      setIsOtpVerified(false);
    } else if (id === "password") {
      setPassword(value);
    }
  };

  const handleDateChange = (event: { target: { value: SetStateAction<string> } }) => {
    setSelectedDate(event.target.value);
  };

  const handleSendOtp = async () => {
    setLoading(true);
    setMessage("");
    setOtpError("");
    try {
      const response = await fetch(`${API_BASE_URL}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobileNumber,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setOtpSent(true);
        setShowOtpInput(true);
        setMessage("OTP sent successfully to your email.");
      } else {
        setOtpError(data.message || "Failed to send OTP.");
      }
    } catch (err) {
      setOtpError("Network error. Please try again.");
    }
    setLoading(false);
  };

  const verifyOtpManually = async () => {
    if (otp.length !== 6) {
      setOtpVerified(false);
      setOtpError("Please enter a valid 6-digit OTP.");
      return;
    }
    setLoading(true);
    setOtpError("");
    setMessage("");
    try {
      const response = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobileNumber,
          otp,
        }),
      });
      const data = await response.json();
      if (response.ok && data.verified) {
        setOtpVerified(true);
        setMessage("OTP verified successfully.");
      } else {
        setOtpVerified(false);
        setOtpError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setOtpVerified(false);
      setOtpError("Network error. Please try again.");
    }
    setLoading(false);
  };

  const handleContinue = async () => {
    if (isFormValid) {
      alert("Registration successful!");
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#CFFAFE] flex flex-col">
      {/* Logo placeholder */}
      <div className="py-6 flex justify-center">
        <span className="text-2xl font-bold text-blue-900">LOGO</span>
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center w-full px-4 sm:px-6 md:px-10 flex-1 py-6 md:py-10">
        <div className="w-full md:w-1/2 flex items-center justify-center mb-8 md:mb-0">
          <div className="bg-gradient-to-r from-gray-100 to-white shadow-lg shadow-gray-100 shadow-inner rounded-2xl border-2 border-sky-300 p-8 sm:p-10 text-center w-full max-w-xl">
            <h2 className="text-blue-900 text-xl font-bold mb-1">
              Create Your Account
            </h2>
            <div className="text-black text-base mb-4 font-semibold">Join the regulatory platform</div>
            {/* User type selection as selectable options, left-aligned */}
            <div className="mb-4">
              <div className="font-bold mb-2 text-left">I am</div>
              <div className="flex flex-wrap gap-2 bg-white py-2 rounded shadow text-left">
                {[
                  { label: 'Doctor', value: 'doctor', icon: '👨‍⚕️' },
                  { label: 'Patient', value: 'patient', icon: '🧑‍🦽' },
                  { label: 'Manufacturer', value: 'manufacturer', icon: '🏭' },
                  { label: 'Hospital Staff', value: 'hospital_staff', icon: '🏥' },
                  { label: 'Media', value: 'media', icon: '📰' },
                ].map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSelectedUserType(option.value)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full border transition-all text-sm font-medium
                      ${selectedUserType === option.value
                        ? 'bg-blue-100 border-blue-500 text-blue-700 shadow'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'}
                    `}
                  >
                    <span>{option.icon}</span> {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative mb-2">
              <input
                type="text"
                id="name"
                value={name}
                onChange={handleNameChange}
                maxLength={100}
                className="peer w-full pt-5 border-b border-gray-400 focus:outline-none py-1 placeholder-transparent"
                placeholder="Name"
              />
              <label
                htmlFor="name"
                className="absolute left-0 top-1 text-gray-500 text-sm transition-all duration-200 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-gray-400 peer:not(:placeholder-shown):top-1 peer:not(:placeholder-shown):text-sm peer:not(:placeholder-shown):text-blue-900"
              >
                Name
              </label>
            </div>
            <div className="mb-2 flex flex-col justify-start w-full max-w-xs">
              <label
                htmlFor="gender"
                className="text-sm text-gray-400 mb-1 text-left"
              >
                Gender
              </label>
              <select
                id="gender"
                onChange={(e) => setGender(e.target.value)}
                className="pl-3 py-2 border-b text-sm border-gray-400 focus:outline-none bg-transparent appearance-none text-left"
                defaultValue=""
              >
                <option value="" disabled hidden className="text-left-800">
                  Select Gender
                </option>
                <option value="male" className="text-left">
                  Male
                </option>
                <option value="female" className="text-left">
                  Female
                </option>
                <option value="other" className="text-left">
                  Other
                </option>
              </select>
            </div>
            <div className="relative mb-4">
              <input
                type="password"
                id="password"
                value={password}
                onChange={handleInputChange}
                className="peer w-full pt-5 border-b border-gray-400 focus:outline-none py-1 placeholder-transparent"
                placeholder="Password"
              />
              <label
                htmlFor="password"
                className="absolute left-0 top-1 text-gray-500 text-sm transition-all duration-200 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-sky-400 peer:not(:placeholder-shown):top-1 peer:not(:placeholder-shown):text-xs peer:not(:placeholder-shown):text-blue-900"
              >
                6-digit passcode
              </label>
            </div>
            <div className="relative border-2 w-50 border-gray-300 focus-within:border-blue-600 focus-within:ring-blue-600 mb-2 px-3 pt-2 rounded-md">
              <input
                type="date"
                id="date"
                name="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="peer w-full pt-1 pb-1 focus:outline-none text-sm"
              />
              <label
                htmlFor="date"
                className="absolute left-3 top-[-10px] bg-gray-200 px-1 text-gray-600 text-xs transition-all duration-200 peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-blue-600"
              >
                Date of Birth
              </label>
            </div>
            <div className="flex flex-col gap-2 mb-2">
              {/* Email Input + OTP Button */}
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-2 mb-2">
                <div className="w-full relative">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={handleInputChange}
                    className="peer w-full pt-5 py-1 border-b border-gray-400 focus:outline-none placeholder-transparent"
                    placeholder="Email"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-0 top-1 text-gray-500 text-xs transition-all duration-200 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-gray-500 peer:not(:placeholder-shown):top-2 peer:not(:placeholder-shown):text-xs"
                  >
                    Email
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading || !email}
                  className={`text-sm w-full sm:w-40 h-8 bg-lime-500 border-none rounded text-black cursor-pointer mt-2 sm:mt-0 ${loading || !email ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Sending...' : buttonText}
                </button>
              </div>
              {/* Mobile Number */}
              <div className="relative mb-2">
                <input
                  type="text"
                  id="mobileNumber"
                  value={mobileNumber}
                  onChange={handleInputChange}
                  maxLength={10}
                  className="peer w-full pt-5 border-b border-gray-400 focus:outline-none py-1 placeholder-transparent"
                  placeholder="Mobile Number"
                />
                <label
                  htmlFor="mobileNumber"
                  className="absolute left-0 top-1 text-gray-500 text-sm transition-all duration-200 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-gray-500"
                >
                  Mobile Number
                </label>
              </div>
              {/* OTP Input */}
              {showOtpInput && (
                <div className="relative mb-2 w-full">
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={handleOtpChange}
                    maxLength={6}
                    className="peer w-full pt-5 border-b border-gray-400 focus:outline-none py-1 placeholder-transparent"
                    placeholder="Enter OTP"
                  />
                  <label
                    htmlFor="otp"
                    className="absolute left-0 top-1 text-gray-500 text-sm transition-all duration-200 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-gray-500"
                  >
                    Enter OTP
                  </label>
                  {/* Verify OTP Button */}
                  <button
                    type="button"
                    onClick={verifyOtpManually}
                    disabled={loading || otp.length !== 6}
                    className={`mt-2 text-sm px-4 py-1 rounded bg-blue-600 text-white w-full sm:w-auto ${
                      loading || otp.length !== 6
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-blue-700"
                    }`}
                  >
                    {loading ? 'Verifying...' : 'VERIFY OTP'}
                  </button>
                  {/* Message */}
                  {message && (
                    <p className="text-xs mt-1 text-green-600">{message}</p>
                  )}
                  {otpError && (
                    <p className="text-xs mt-1 text-red-500">{otpError}</p>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row justify-between text-xs text-gray-600 mb-4 gap-2">
              <p
                onClick={() => router.push("/login")}
                className="inline-block border-b border-gray-400 cursor-pointer"
              >
                Already Have an Account?
              </p>
              <p className="cursor-pointer border-b border-gray-400">
                Resend OTP
              </p>
            </div>
            {/* Terms & Conditions */}
            <div className="flex flex-col sm:flex-row items-start text-black gap-2 sm:gap-4">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mr-2 accent-lime-500 mt-1"
                />
                <div>
                  <p className="text-xs text-left">
                    I have read and accept the Terms of
                  </p>
                  <div className="text-sm text-left">
                    <span className="text-gray-600 cursor-pointer">
                      Service & Privacy Policy
                    </span>
                  </div>
                </div>
              </div>
              {/* Continue Button */}
              <div className="w-full sm:w-auto mt-4 sm:mt-0">
                <button
                  onClick={handleContinue}
                  disabled={!isFormValid}
                  className={`bg-lime-500 text-sm text-black py-2 px-5 rounded-full cursor-pointer w-full sm:w-auto 
                                    ${
                                      !isFormValid
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:bg-lime-600"
                                    }`}
                >
                  CONTINUE
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center">
          <h2 className="text-blue-900 text-lg font-semibold px-4">
            Welcome to NIMHANS{" "}
          </h2>
          <p className="text-gray-500 text-sm px-4 mb-4">
            Register now to connect, contribute, and care together. {" "}
          </p>
          <Image
            src="/RegisterRight.png"
            alt="Illustration"
            width={300}
            height={250}
            className="max-w-full h-auto"
          />
        </div>
      </div>
      {/* Footer placeholder */}
      <div className="bg-[#CFFAFE] w-full text-center py-3 mt-8">
        <p className="text-xs text-gray-600">
          © 2024 Rakshaayan. All rights reserved
        </p>
      </div>
    </div>
  );
} 