"use client";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const router = useRouter();
  function handleSubmit(e: any) {
    e.preventDefault();
    // For integration, send axios request here
    router.push("/profile");
  }
  return (
    <form onSubmit={handleSubmit}>
      <h2>Change Password</h2>
      <input placeholder="Old Password" type="password" name="old_password" /><br/>
      <input placeholder="New Password" type="password" name="new_password" /><br/>
      <button type="submit">Change Password</button>
    </form>
  );
} 