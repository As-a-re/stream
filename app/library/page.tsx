"use client";
import { useWallet } from '@suiet/wallet-kit';
import { useEffect, useState } from 'react';
import RequireWallet from '@/components/RequireWallet';

export default function LibraryPage() {
  const { account } = useWallet();
  const [owned, setOwned] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!account?.address) return;
    setLoading(true);
    fetch('/api/sui/owned', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet: account.address })
    })
      .then(res => res.json())
      .then(data => setOwned(data.owned || []))
      .finally(() => setLoading(false));
  }, [account]);

  return (
    <RequireWallet>
      <main className="min-h-screen bg-background p-8">
        <h1 className="text-3xl font-bold mb-6">Your Library</h1>
        {loading ? (
          <div>Loading your library...</div>
        ) : owned.length === 0 ? (
          <div>You have not purchased any movies or TV shows yet.</div>
        ) : (
          <ul className="space-y-4">
            {owned.map((item, idx) => (
              <li key={idx} className="border rounded p-4">
                <span className="font-semibold">{item.title || item.id}</span>
              </li>
            ))}
          </ul>
        )}
      </main>
    </RequireWallet>
  );
}
