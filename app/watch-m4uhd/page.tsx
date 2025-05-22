import React, { useState } from "react";

const M4uHdWatchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [streamUrl, setStreamUrl] = useState("");

  // Step 1: Search function (scrapes m4uhd.onl search results)
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);
    setSelectedMovie(null);
    setStreamUrl("");
    try {
      // m4uhd search url: https://m4uhd.onl/search/{query}.html
      const res = await fetch(`/api/m4uhd-search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      setError("Failed to fetch results.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Get stream link for selected movie
  const handleSelectMovie = async (movie: any) => {
    setSelectedMovie(movie);
    setStreamUrl("");
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/m4uhd-stream?url=${encodeURIComponent(movie.url)}`);
      const data = await res.json();
      setStreamUrl(data.streamUrl || "");
    } catch (err) {
      setError("Failed to fetch stream link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold mb-6">Watch Movies from m4uhd.onl</h1>
      <form onSubmit={handleSearch} className="mb-8 flex gap-2">
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="border rounded p-2 flex-1"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {!selectedMovie && results.length > 0 && (
        <ul className="space-y-2 mb-8">
          {results.map((movie, idx) => (
            <li key={idx} className="border p-4 rounded flex justify-between items-center">
              <span>{movie.title}</span>
              <button
                className="bg-green-600 text-white px-3 py-1 rounded"
                onClick={() => handleSelectMovie(movie)}
              >
                Watch
              </button>
            </li>
          ))}
        </ul>
      )}
      {selectedMovie && (
  <div className="mb-8">
    <BuyOrWatch
      movieId={selectedMovie.url}
      infoUrl={selectedMovie.url}
      streamUrl={streamUrl}
    />
    <button
      className="mt-4 bg-gray-600 text-white px-3 py-1 rounded"
      onClick={() => {
        setSelectedMovie(null);
        setStreamUrl("");
      }}
    >
      Back to results
    </button>
  </div>
)}
    </main>
  );
};

export default M4uHdWatchPage;
