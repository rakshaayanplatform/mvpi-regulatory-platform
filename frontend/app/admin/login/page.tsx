"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/utils/axiosInstance";

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setDebugInfo("");

    try {
      // Call the real login API
      const response = await api.post('/login/', {
        username: formData.username,
        password: formData.password
      });

      console.log('Login response:', response.data); // Debug log
      console.log('Response status:', response.status); // Debug log
      console.log('Response headers:', response.headers); // Debug log
      
      const userData = response.data.user;
      
      // Check if user data exists
      if (!userData) {
        setError("Login failed: No user data received from server.");
        return;
      }
      
      // Check if user is admin
      if (userData.user_type !== 'admin') {
        setError("Access denied. Only administrators can access this panel.");
        return;
      }

      // Store authentication data
      localStorage.setItem("adminAuthenticated", "true");
      localStorage.setItem("adminUser", JSON.stringify(userData));
      localStorage.setItem("adminAccessToken", response.data.access_token || "authenticated");
      
      setDebugInfo("Login successful! Redirecting to admin dashboard...");
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 1000);

    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.response?.status === 401) {
        setError("Invalid username or password. Please try again.");
      } else if (error.response?.status === 403) {
        setError("Access denied. Only administrators can access this panel.");
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        setError("Cannot connect to server. Please ensure the backend server is running on port 8001.");
      } else {
        setError("Login failed. Please check your connection and try again.");
      }
      
      setDebugInfo(`Error: ${error.message} | Status: ${error.response?.status} | Data: ${JSON.stringify(error.response?.data)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };



  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-800 mb-2">NIMHANS</div>
          <h2 className="text-2xl font-bold text-gray-900">Administrator Access</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your administrator credentials to access the admin panel
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <strong>Error:</strong> {error}
              </div>
            )}

            {debugInfo && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
                <strong>Debug:</strong> {debugInfo}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Authenticating...
                  </div>
                ) : (
                  "Access Admin Panel"
                )}
              </button>
            </div>
          </form>



          {/* Security Notice */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-yellow-600">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Security Notice
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    This area is restricted to authorized administrators only. 
                    All access attempts are logged and monitored.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Main Site */}
          <div className="mt-6 text-center">
            <Link 
              href="/"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              ← Back to main site
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>NIMHANS Medical Device Monitoring Center</p>
          <p>Administrative Access Portal</p>
        </div>
      </div>
    </div>
  );
} 