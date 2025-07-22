"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [role, setRole] = useState("patient");
  useEffect(() => {
    const r = localStorage.getItem("userRole") || "patient";
    setRole(r);
  }, []);
  return (
    <div>
      <h2>Welcome to dashboard, {role}!</h2>
      <Link href="/profile">Profile</Link><br/>
      <Link href="/logout">Logout</Link>
    </div>
  );
} 