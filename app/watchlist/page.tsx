"use client";
import { useEffect, useState } from 'react';
import RequireWallet from '@/components/RequireWallet';

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<any[]>([]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!account?.address) return;
      const res = await fetch(`/api/sui/watchlist?wallet=${account.address}`);
      const data = await res.json();
      setWatchlist(data.watchlist || []);
    };
    fetchWatchlist();
  }, [account]);

  const removeFromWatchlist = (id: string) => {
    const updated = watchlist.filter(item => item.id !== id);
    setWatchlist(updated);
    localStorage.setItem('watchlist', JSON.stringify(updated));
  };

  return (
    <RequireWallet>
      <main className="min-h-screen bg-background p-8">
        <h1 className="text-3xl font-bold mb-6">Your Watchlist</h1>
        {watchlist.length === 0 ? (
          <div>Your watchlist is empty.</div>
        ) : (
          <ul className="space-y-4">
            {watchlist.map((item, idx) => (
              <li key={idx} className="border rounded p-4 flex justify-between items-center">
                <span className="font-semibold">{item.title || item.id}</span>
                <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => removeFromWatchlist(item.id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </RequireWallet>
  );
}
