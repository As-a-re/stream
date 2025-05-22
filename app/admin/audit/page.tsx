"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuditLogPage() {
  const router = useRouter();
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const jwt = document.cookie.split('; ').find(row => row.startsWith('admin_jwt='));
      if (!jwt) router.replace('/admin/login');
    }
  }, []);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/admin/audit")
      .then(res => res.json())
      .then(data => setLogs(data.logs || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", fontFamily: "monospace" }}>
      <h2>Admin: Audit Log</h2>
      {loading && <div>Loading...</div>}
      <ul style={{ padding: 0 }}>
        {logs.map((log, i) => (
          <li key={i} style={{ marginBottom: 10, listStyle: "none", borderBottom: "1px solid #eee", paddingBottom: 8 }}>
            <div><b>{log.timestamp}</b> — <span style={{ color: '#0070f3' }}>{log.action}</span></div>
            <div>Admin: {log.admin}</div>
            <pre style={{ fontSize: 13, background: '#f8f8f8', padding: 8, borderRadius: 4 }}>{JSON.stringify(log.details, null, 2)}</pre>
          </li>
        ))}
      </ul>
      {logs.length === 0 && !loading && <div>No audit entries found.</div>}
    </div>
  );
}
