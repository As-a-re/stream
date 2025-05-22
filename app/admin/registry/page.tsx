"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegistryAdminPage() {
  const router = useRouter();
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const jwt = document.cookie.split('; ').find(row => row.startsWith('admin_jwt='));
      if (!jwt) router.replace('/admin/login');
    }
  }, []);
  const [adminSecret, setAdminSecret] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [wallet, setWallet] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function fetchRegistry() {
    setLoading(true);
    setMessage("");
    const res = await fetch("/api/admin/registry", {
      headers: { "x-admin-secret": adminSecret },
    });
    if (res.ok) {
      const data = await res.json();
      setUsers(Object.entries(data.users || {}));
      setMessage("Fetched registry.");
    } else {
      setMessage("Failed to fetch registry");
    }
    setLoading(false);
  }

  async function addUser() {
    setLoading(true);
    setMessage("");
    const res = await fetch("/api/admin/registry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": adminSecret,
      },
      body: JSON.stringify({ wallet }),
    });
    if (res.ok) {
      setMessage("User onboarded and objects created.");
      fetchRegistry();
    } else {
      setMessage("Failed to add user");
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>Admin: Sui Object Registry</h2>
      <input
        type="password"
        placeholder="Admin Secret"
        value={adminSecret}
        onChange={e => setAdminSecret(e.target.value)}
        style={{ marginBottom: 10, width: "100%" }}
      />
      <button onClick={fetchRegistry} disabled={loading || !adminSecret}>
        View Registry
      </button>
      <hr />
      <h3>Onboard New User</h3>
      <input
        type="text"
        placeholder="Wallet Address"
        value={wallet}
        onChange={e => setWallet(e.target.value)}
        style={{ marginBottom: 10, width: "100%" }}
      />
      <button onClick={addUser} disabled={loading || !wallet || !adminSecret}>
        Add User
      </button>
      <hr />
      <h3>Registered Users</h3>
      {users.length === 0 && <div>No users found.</div>}
      <ul>
        {users.map(([w, obj]: any) => (
  <li key={w} style={{ marginBottom: 16 }}>
    <b>{w}</b>
    <div style={{ fontSize: 13 }}>
      Library: <input style={{ width: 220 }} defaultValue={obj.library} id={`lib-${w}`} />
      <br />
      Watchlist: <input style={{ width: 220 }} defaultValue={obj.watchlist} id={`wl-${w}`} />
    </div>
    <button
      style={{ marginRight: 8 }}
      onClick={async () => {
        setLoading(true);
        setMessage("");
        const res = await fetch("/api/admin/registry", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-admin-secret": adminSecret,
          },
          body: JSON.stringify({ wallet: w }),
        });
        if (res.ok) {
          setMessage("User removed.");
          fetchRegistry();
        } else {
          setMessage("Failed to remove user");
        }
        setLoading(false);
      }}
      disabled={loading || !adminSecret}
    >Remove</button>
    <button
      onClick={async () => {
        setLoading(true);
        setMessage("");
        const libraryId = (document.getElementById(`lib-${w}`) as HTMLInputElement).value;
        const watchlistId = (document.getElementById(`wl-${w}`) as HTMLInputElement).value;
        const res = await fetch("/api/admin/registry", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-admin-secret": adminSecret,
          },
          body: JSON.stringify({ wallet: w, libraryId, watchlistId }),
        });
        if (res.ok) {
          setMessage("User updated.");
          fetchRegistry();
        } else {
          setMessage("Failed to update user");
        }
        setLoading(false);
      }}
      disabled={loading || !adminSecret}
    >Update</button>
  </li>
))}
      </ul>
      {message && <div style={{ marginTop: 20, color: "#0070f3" }}>{message}</div>}
    </div>
  );
}
