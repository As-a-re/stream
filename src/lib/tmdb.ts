// TMDB API utility
const API_KEY = "";
const BASE_URL = "https://api.themoviedb.org/3";

export const fetchTrending = async (type = "all", time = "day") => {
  const res = await fetch(`${BASE_URL}/trending/${type}/${time}?api_key=${API_KEY}`);
  return res.json();
};

export const fetchMovies = async (page = 1) => {
  const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`);
  return res.json();
};

export const fetchTVShows = async (page = 1) => {
  const res = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&page=${page}`);
  return res.json();
};

export const fetchMovieDetails = async (id) => {
  const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
  return res.json();
};

export const fetchTVDetails = async (id) => {
  const res = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}`);
  return res.json();
};

export const searchTMDB = async (query, type = "multi", page = 1) => {
  const res = await fetch(`${BASE_URL}/search/${type}?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
  return res.json();
};
