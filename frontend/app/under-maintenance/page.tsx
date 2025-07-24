"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RefreshCcw, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function MaintenancePage() {
  const router = useRouter();
  const [showPage, setShowPage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowPage(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50 p-4 sm:p-6">
      {showPage && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-[600px] sm:h-[500px] bg-white shadow-md rounded-2xl flex flex-col items-center px-6 sm:px-10 py-12 sm:py-16 gap-6 sm:gap-8"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex items-center gap-2 sm:gap-3"
          >
            <div className="text-blue-600 text-xl sm:text-2xl font-bold">Rakshaayan</div>
            <div className="text-blue-600 text-lg sm:text-xl">➕</div>
          </motion.div>

          {/* Maintenance Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", type: "spring", bounce: 0.4 }}
            className="text-yellow-500 text-5xl sm:text-6xl"
          >
            🔧
          </motion.div>

          {/* Title + Subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="text-center"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Under Maintenance</h1>
            <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">
              We're working to improve your experience
            </p>
          </motion.div>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.4 }}
            className="text-center text-gray-500 px-2 sm:px-4 text-sm sm:text-base leading-relaxed"
          >
            We're currently performing scheduled maintenance to improve your experience. Please check back soon.
          </motion.p>

          {/* Estimated Time */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.4 }}
            className="flex items-center gap-2 text-gray-500 text-sm sm:text-base"
          >
            <Clock className="w-4 h-4" />
            <span>Estimated completion: 2 hours</span>
          </motion.div>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.location.reload()}
            className="mt-2 sm:mt-4 flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all text-sm sm:text-base"
          >
            <RefreshCcw className="w-4 h-4" />
            <span>Check Status</span>
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
