"use client";
import { useWallet } from '@suiet/wallet-kit';
import { useEffect, useState } from 'react';

interface BuyOrWatchProps {
  movieId: string;
  infoUrl: string;
  streamUrl: string;
}

export default function BuyOrWatch({ movieId, infoUrl, streamUrl }: BuyOrWatchProps) {
  const { account, signAndExecuteTransactionBlock } = useWallet();
  const [owned, setOwned] = useState(false);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    if (!account?.address) return;
    setLoading(true);
    fetch('/api/sui/owned', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movieId, wallet: account.address })
    })
      .then(res => res.json())
      .then(data => setOwned(!!data.owned))
      .catch(() => setOwned(false))
      .finally(() => setLoading(false));
    // Fetch movie info
    fetch(`/api/m4uhd-info?url=${encodeURIComponent(infoUrl)}`)
      .then(res => res.json())
      .then(data => setInfo(data.info));
  }, [account, movieId, infoUrl]);

  const handleBuy = async () => {
    if (!account?.address) return;
    setBuying(true);
    setError("");
    try {
      const res = await fetch('/api/sui/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId, wallet: account.address })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to create transaction');
      // Ask user to sign and execute the tx block
      await signAndExecuteTransactionBlock({
        transactionBlock: data.txb,
      });
      setOwned(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBuying(false);
    }
  };

  if (loading) return <div>Checking ownership...</div>;
  if (!info) return <div>Loading info...</div>;

  return (
    <div className="border rounded p-4">
      <h2 className="text-2xl font-bold mb-2">{info.title}</h2>
      {info.poster && <img src={info.poster} alt={info.title} className="mb-2 w-48" />}
      <p className="mb-4">{info.synopsis}</p>
      {owned ? (
        <iframe
          src={streamUrl}
          title="Movie Player"
          width="100%"
          height="500"
          allowFullScreen
          className="rounded border"
        />
      ) : (
        <>
          <button
            onClick={handleBuy}
            className="bg-green-600 text-white px-4 py-2 rounded"
            disabled={buying}
          >
            {buying ? 'Processing...' : 'Buy to Watch'}
          </button>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </>
      )}
    </div>
  );
}
