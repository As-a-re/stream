import { useCurrentAccount, ConnectButton } from '@mysten/dapp-kit';
import MovieGrid from "../components/MovieGrid"

const Movies = () => {
  const currentAccount = useCurrentAccount();
  const isConnected = !!currentAccount;
  
  return (
    <div className="bg-[#0f172a] min-h-screen text-white">
      <main className="container mx-auto px-4 py-8">
        {isConnected && currentAccount ? (
          <MovieGrid />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-6">Connect your wallet to browse movies</p>
            <ConnectButton />
          </div>
        )}
      </main>
    </div>
  )
}

export default Movies
