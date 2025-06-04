import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { WalletButton } from "./WalletButton";

const Navbar: React.FC = () => {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search)}`);
      setMenuOpen(false);
    }
  };

  return (
    <nav className="bg-[#131a2b] shadow-md sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center gap-4 md:gap-8">
          <Link to="/dashboard" className="text-xl font-bold text-white">
            <span className="text-blue-400">Sui</span> Stream
          </Link>
        </div>
        {/* Hamburger menu button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16"
              />
            )}
          </svg>
        </button>
        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
          <Link to="/movies" className="text-white hover:text-blue-400 transition">Movies</Link>
          <Link to="/tv-shows" className="text-white hover:text-blue-400 transition">TV Shows</Link>
          <Link to="/collection" className="text-white hover:text-blue-400 transition">My Collection</Link>
          <form onSubmit={handleSearch} className="flex items-center gap-2 ml-4">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="rounded bg-[#19223a] text-white px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button type="submit" className="text-blue-400 font-semibold hover:underline">Search</button>
          </form>
        </div>
        <div className="hidden md:block ml-4">
          <WalletButton />
        </div>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 animate-fade-in-up">
          <Link
            to="/movies"
            className="block text-white hover:text-blue-400 transition"
            onClick={() => setMenuOpen(false)}
          >
            Movies
          </Link>
          <Link
            to="/tv-shows"
            className="block text-white hover:text-blue-400 transition"
            onClick={() => setMenuOpen(false)}
          >
            TV Shows
          </Link>
          <Link
            to="/collection"
            className="block text-white hover:text-blue-400 transition"
            onClick={() => setMenuOpen(false)}
          >
            My Collection
          </Link>
          <form onSubmit={handleSearch} className="flex items-center gap-2 mt-2">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="rounded bg-[#19223a] text-white px-3 py-1 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button type="submit" className="text-blue-400 font-semibold hover:underline">Search</button>
          </form>
          <div className="mt-2">
            <WalletButton />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;