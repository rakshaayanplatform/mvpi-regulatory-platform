"use client";

import { useRouter } from "next/navigation";

export default function HelpCenter() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white p-6 md:p-10">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">Dashboard &gt; Help</div>

      {/* Title */}
      <h1 className="text-3xl font-bold mb-8">Help Center</h1>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search for help topics..."
        className="w-full max-w-xl p-3 border rounded-lg mb-8"
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* FAQ Section */}
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">🧠 Frequently Asked Questions</h2>

          <div className="mb-4">
            <p className="font-medium">How do I report an adverse event?</p>
            <p className="text-sm text-gray-700">Click on “Report Event” in your dashboard and complete the form with accurate information.</p>
          </div>

          <div className="mb-4">
            <p className="font-medium">How long does it take to process my report?</p>
            <p className="text-sm text-gray-700">It typically takes 3–5 working days to process and review a submitted report.</p>
          </div>

          <div>
            <p className="font-medium">Can I edit my report after submission?</p>
            <p className="text-sm text-gray-700">Editing is allowed within 24 hours by contacting the support team.</p>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">📞 Contact Support</h2>
          <p className="mb-1">Email:</p>
          <p className="text-blue-700 mb-2">support@rakshwayan.gov.in</p>

          <p className="mb-1">Phone:</p>
          <p className="text-sm mb-2">+91 22 1234 5678</p>

          <p className="text-sm mb-4">Available Monday to Friday, 3:00 AM – 6:00 PM IST</p>

          <button
            onClick={() => alert("Live chat feature coming soon")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
          >
            Start Chat
          </button>
        </div>
      </div>

      {/* Live Chat Placeholder */}
      <div className="fixed bottom-4 right-4 w-72 bg-white border shadow-lg rounded-lg">
        <div className="bg-gray-100 p-3 border-b font-medium">Live Support</div>
        <div className="p-3 space-y-2 text-sm">
          <p><strong>Agent:</strong> Online</p>
          <p>Hello! How can I help you today?</p>
          <input
            type="text"
            placeholder="Type your message..."
            className="w-full p-2 border rounded"
          />
          <button className="bg-blue-600 text-white w-full py-2 rounded mt-2 hover:bg-blue-700 transition">Send</button>
        </div>
      </div>
    </div>
  );
}
