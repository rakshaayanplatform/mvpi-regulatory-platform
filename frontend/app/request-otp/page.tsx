"use client";
import { useRouter } from "next/navigation";

export default function RequestOtpPage() {
  const router = useRouter();

  function handleSubmit(e: any) {
    e.preventDefault();
    router.push("/verify-otp");
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#CFFAFE] px-4">
      <div className="py-6 text-center">
        <span className="text-2xl font-bold text-blue-900">LOGO</span>
      </div>

      <div className="flex-grow">
        <form
          onSubmit={handleSubmit}
          className="max-w-xl w-full mx-auto bg-gradient-to-r from-gray-400/10 to-[#CFFAFE] border border-sky-300 rounded-xl p-8 space-y-6"
        >
          <h2 className="text-xl font-bold text-blue-900 mb-2 text-center">
            Request OTP
          </h2>

          <div className="relative">
            <label className="block relative cursor-text">
              <input
                type="text"
                name="contact"
                placeholder="Email or Phone"
                className="peer w-full border-b border-gray-400 bg-transparent py-4 placeholder-transparent focus:outline-none focus:border-blue-500"
              />
              <span className="absolute left-0 top-0 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-600">
                Email or Phone
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-2 rounded-full hover:bg-blue-800 transition font-semibold"
          >
            Request OTP
          </button>
        </form>
      </div>

      <footer className="text-center py-4 text-sm text-gray-600">
        © 2024 Rakshaayan. All rights reserved.
      </footer>
    </div>
  );
}
