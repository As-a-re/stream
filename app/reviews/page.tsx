"use client";
import { useEffect, useState } from 'react';
import RequireWallet from '@/components/RequireWallet';

interface Review {
  movieId: string;
  user: string;
  text: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [movieId, setMovieId] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      if (!movieId) return;
      const res = await fetch(`/api/sui/reviews?content_id=${movieId}`);
      const data = await res.json();
      setReviews(data.reviews || []);
    };
    fetchReviews();
  }, [movieId]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!movieId || !text) return;
    const review: Review = { movieId, user: 'You', text };
    const updated = [...reviews, review];
    setReviews(updated);
    localStorage.setItem('reviews', JSON.stringify(updated));
    setText('');
  };

  return (
    <RequireWallet>
      <main className="min-h-screen bg-background p-8">
        <h1 className="text-3xl font-bold mb-6">Reviews</h1>
        <form onSubmit={handleSubmit} className="mb-6">
          <input
            className="border px-2 py-1 rounded mr-2"
            placeholder="Movie/Show ID or URL"
            value={movieId}
            onChange={e => setMovieId(e.target.value)}
          />
          <input
            className="border px-2 py-1 rounded mr-2 w-96"
            placeholder="Your review"
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-4 py-1 rounded" type="submit">
            Submit
          </button>
        </form>
        <ul className="space-y-4">
          {reviews.map((r, idx) => (
            <li key={idx} className="border rounded p-4">
              <div className="font-semibold">{r.movieId}</div>
              <div>{r.text}</div>
              <div className="text-xs text-gray-500">by {r.user}</div>
            </li>
          ))}
        </ul>
      </main>
    </RequireWallet>
  );
}
