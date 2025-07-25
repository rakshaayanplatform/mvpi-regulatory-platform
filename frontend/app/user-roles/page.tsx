"use client";

export default function UserRolesPage() {
  const roles = ["patient", "doctor", "healthcare professional", "admin"];
  return (
    <div>
      <h2>User Roles</h2>
      <ul>
        {roles.map(role => <li key={role}>{role}</li>)}
      </ul>
    </div>
  );
} 