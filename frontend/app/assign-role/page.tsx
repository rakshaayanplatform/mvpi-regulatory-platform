"use client";
import { useRouter } from "next/navigation";

export default function AssignRolePage() {
  const router = useRouter();
  function handleSubmit(e: any) {
    e.preventDefault();
    // For integration, send axios request here
    router.push("/user-roles");
  }
  return (
    <form onSubmit={handleSubmit}>
      <h2>Assign Role</h2>
      <input placeholder="User" name="user" /><br/>
      <input placeholder="Role" name="role" /><br/>
      <button type="submit">Assign</button>
    </form>
  );
} 