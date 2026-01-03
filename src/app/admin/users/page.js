"use client";
import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/users");
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load users");
        setUsers(json.users || []);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, []);

  return (
    <main style={{ maxWidth: 1000, margin: "40px auto", padding: 24 }}>
      <h2>Users</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th>Created</Th>
            <Th>Preference</Th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <Td>{u.id}</Td>
              <Td>{u.name}</Td>
              <Td>{u.email}</Td>
              <Td>{u.role}</Td>
              <Td>{new Date(u.createdAt).toLocaleString()}</Td>
              <Td>
                {u.preference
                  ? `${u.preference.careerStage} · ${u.preference.energyLevel} · ${u.preference.tone} · ${u.preference.movementComfort}`
                  : "-"}
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

function Th({ children }) {
  return (
    <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: "8px" }}>{children}</th>
  );
}

function Td({ children }) {
  return <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{children}</td>;
}
