"use client";

export default function AuditLogsPage() {
  const logs = [
    "User X logged in",
    "User Y changed password",
    "User Z updated profile"
  ];
  return (
    <div>
      <h2>Audit Logs</h2>
      <ul>
        {logs.map((log, i) => <li key={i}>{log}</li>)}
      </ul>
    </div>
  );
} 