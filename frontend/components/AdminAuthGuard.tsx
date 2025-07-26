"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = () => {
    // Skip authentication check for login page
    if (typeof window !== 'undefined' && window.location.pathname === '/admin/login') {
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    const adminAuthenticated = localStorage.getItem("adminAuthenticated");
    const adminUser = localStorage.getItem("adminUser");
    const adminAccessToken = localStorage.getItem("adminAccessToken");

    if (adminAuthenticated === "true" && adminUser && adminAccessToken) {
      try {
        const userData = JSON.parse(adminUser);
        // Additional check: verify the user is actually an admin
        if (userData.user_type === "admin" || userData.is_superuser) {
          setIsAuthenticated(true);
        } else {
          // User is not an admin, redirect to admin login
          clearAdminAuth();
          router.push("/admin/login");
        }
      } catch (error) {
        console.error("Error parsing admin user data:", error);
        clearAdminAuth();
        router.push("/admin/login");
      }
    } else {
      // No admin authentication found, redirect to admin login
      router.push("/admin/login");
    }
    setIsLoading(false);
  };

  const clearAdminAuth = () => {
    localStorage.removeItem("adminAuthenticated");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminAccessToken");
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
} 