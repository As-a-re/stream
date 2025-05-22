"use client";
import { useWallet } from '@suiet/wallet-kit';
import { ReactNode } from 'react';

export default function RequireWallet({ children }: { children: ReactNode }) {
  const { connected, connect } = useWallet();

  if (!connected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="mb-4 text-lg">Connect your Sui wallet to access content.</p>
        <button onClick={connect} className="bg-blue-600 text-white px-4 py-2 rounded">
          Connect Wallet
        </button>
      </div>
    );
  }
  return <>{children}</>;
}
