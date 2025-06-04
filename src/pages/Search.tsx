import { useState } from "react"
import { useCurrentAccount, ConnectButton } from '@mysten/dapp-kit';
import SearchBar from "../components/SearchBar"
import SearchResults from "../components/SearchResults"

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const currentAccount = useCurrentAccount();
  const isConnected = !!currentAccount;
  
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // Search logic will be handled by SearchResults component
  }
  
  return (
    <div className="bg-[#0f172a] min-h-screen text-white">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>
        
        {isConnected && currentAccount ? (
          <SearchResults query={searchQuery} />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-6">Connect your wallet to search for content</p>
            <ConnectButton />
          </div>
        )}
      </main>
    </div>
  )
}

export default Search
