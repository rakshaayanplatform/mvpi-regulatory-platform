"use client";

import { useRouter } from "next/navigation";
import { HomeIcon, ArrowLeftIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="w-[600px] h-[500px] bg-white rounded-2xl shadow-md flex flex-col items-center p-16 gap-8 animate-slide-up">
        {/* Logo */}
        <div className="flex items-center gap-3 animate-fade-in">
          <div className="w-6 h-6 bg-blue-600 text-white flex items-center justify-center rounded-full text-sm font-bold">
            +
          </div>
          <h1 className="text-2xl font-bold text-blue-800">Rakshaayan</h1>
        </div>

        {/* Error Icon */}
        <div className="w-30 h-30 text-red-500 animate-bounce-scale">
          <ExclamationTriangleIcon className="w-24 h-24" />
        </div>

        {/* Title */}
        <div className="text-center animate-fade-delay-700">
          <h2 className="text-3xl font-bold text-gray-900">Page Not Found</h2>
          <p className="text-sm text-gray-500 mt-2">Error 404</p>
        </div>

        {/* Message */}
        <p className="text-gray-500 text-center text-base animate-fade-delay-900">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Buttons */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            <HomeIcon className="w-5 h-5" />
            Go Home
          </button>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
