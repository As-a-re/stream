// Fallback data for when the API is unavailable

// Fallback trending content
export function getFallbackTrending() {
  return [
    {
      id: "tt1",
      title: "Inception",
      poster_path: "/placeholder.svg?height=300&width=200",
      backdrop_path: "/placeholder.svg?height=780&width=1280",
      overview:
        "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      release_date: "2010-07-16",
      vote_average: 8.8,
      media_type: "movie",
    },
    {
      id: "tt2",
      title: "Stranger Things",
      poster_path: "/placeholder.svg?height=300&width=200",
      backdrop_path: "/placeholder.svg?height=780&width=1280",
      overview:
        "When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces in order to get him back.",
      first_air_date: "2016-07-15",
      vote_average: 8.6,
      media_type: "tv",
    },
    {
      id: "tt3",
      title: "The Dark Knight",
      poster_path: "/placeholder.svg?height=300&width=200",
      backdrop_path: "/placeholder.svg?height=780&width=1280",
      overview:
        "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
      release_date: "2008-07-18",
      vote_average: 9.0,
      media_type: "movie",
    },
    {
      id: "tt4",
      title: "Breaking Bad",
      poster_path: "/placeholder.svg?height=300&width=200",
      backdrop_path: "/placeholder.svg?height=780&width=1280",
      overview:
        "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
      first_air_date: "2008-01-20",
      vote_average: 9.5,
      media_type: "tv",
    },
    {
      id: "tt5",
      title: "Interstellar",
      poster_path: "/placeholder.svg?height=300&width=200",
      backdrop_path: "/placeholder.svg?height=780&width=1280",
      overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      release_date: "2014-11-07",
      vote_average: 8.6,
      media_type: "movie",
    },
  ]
}

// Fallback movies by category
export function getFallbackMovies(category: string, id?: string) {
  const movies = [
    {
      id: "m1",
      title: "The Shawshank Redemption",
      poster_path: "/placeholder.svg?height=300&width=200",
      backdrop_path: "/placeholder.svg?height=780&width=1280",
      overview:
        "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
      release_date: "1994-09-23",
      vote_average: 9.3,
      genres: [
        { id: 18, name: "Drama" },
        { id: 80, name: "Crime" },
      ],
    },
    {
      id: "m2",
      title: "The Godfather",
      poster_path: "/placeholder.svg?height=300&width=200",
      backdrop_path: "/placeholder.svg?height=780&width=1280",
      overview:
        "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
      release_date: "1972-03-24",
      vote_average: 9.2,
      genres: [
        { id: 18, name: "Drama" },
        { id: 80, name: "Crime" },
      ],
    },
    {
      id: "m3",
      title: "Pulp Fiction",
      poster_path: "/placeholder.svg?height=300&width=200",
      backdrop_path: "/placeholder.svg?height=780&width=1280",
      overview:
        "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
      release_date: "1994-10-14",
      vote_average: 8.9,
      genres: [
        { id: 53, name: "Thriller" },
        { id: 80, name: "Crime" },
      ],
    },
    {
      id: "m4",
      title: "The Matrix",
      poster_path: "/placeholder.svg?height=300&width=200",
      backdrop_path: "/placeholder.svg?height=780&width=1280",
      overview:
        "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
      release_date: "1999-03-31",
      vote_average: 8.7,
      genres: [
        { id: 28, name: "Action" },
        { id: 878, name: "Science Fiction" },
      ],
    },
    {
      id: "m5",
      title: "Forrest Gump",
      poster_path: "/placeholder.svg?height=300&width=200",
      backdrop_path: "/placeholder.svg?height=780&width=1280",
      overview:
        "The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate, and other historical events unfold through the perspective of an Alabama man with an IQ of 75.",
      release_date: "1994-07-06",
      vote_average: 8.8,
      genres: [
        { id: 18, name: "Drama" },
        { id: 35, name: "Comedy" },
      ],
    },
  ]

  // If an ID is provided, return a single movie
  if (id) {
    const movie = movies.find((m) => m.id === id) || movies[0]
    return {
      ...movie,
      runtime: 142,
      tagline: "Fear can hold you prisoner. Hope can set you free.",
      status: "Released",
      budget: 25000000,
      revenue: 280000000,
      production_companies: [
        {
          id: 1,
          name: "Warner Bros.",
          logo_path: "/placeholder.svg?height=50&width=100",
        },
      ],
      videos: {
        results: [
          {
            id: "v1",
            key: "6hB3S9bIaco",
            name: "Trailer",
            site: "YouTube",
            type: "Trailer",
          },
        ],
      },
      credits: {
        cast: [
          {
            id: "c1",
            name: "Actor Name",
            character: "Character Name",
            profile_path: "/placeholder.svg?height=100&width=100",
          },
        ],
        crew: [
          {
            id: "cr1",
            name: "Director Name",
            job: "Director",
            profile_path: "/placeholder.svg?height=100&width=100",
          },
        ],
      },
    }
  }

  return movies
}

// Fallback TV shows by category
export function getFallbackTVShows(category: string, id?: string) {
  const tvShows = [
    {
      id: "tv1",
      name: "Game of Thrones",
      poster_path: "/placeholder.svg?height=300&width=200",
      backdrop_path: "/placeholder.svg?height=780&width=1280",
      overview:
        "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.",
      first_air_date: "2011-04-17",
      vote_average: 9.3,
      genres: [
        { id: 10765, name: "Sci-Fi & Fantasy" },
        { id: 18, name: "Drama" },
      ],
    },
    {
      id: "tv2",
      name: "The Wire",
      poster_path: "/placeholder.svg?height=300&width=200",
      backdrop_path: "/placeholder.svg?height=780&width=1280",
      overview: "Baltimore drug scene, seen through the eyes of drug dealers and law enforcement.",
      first_air_date: "2002-06-02",
      vote_average: 9.3,
      genres: [
        { id: 18, name: "Drama" },
        { id: 80, name: "Crime" },
      ],
    },
    {
      id: "tv3",
      name: "The Sopranos",
      poster_path: "/placeholder.svg?height=300&width=200",
      backdrop_path: "/placeholder.svg?height=780&width=1280",
      overview:
        "New Jersey mob boss Tony Soprano deals with personal and professional issues in his home and business life that affect his mental state.",
      first_air_date: "1999-01-10",
      vote_average: 9.2,
      genres: [
        { id: 18, name: "Drama" },
        { id: 80, name: "Crime" },
      ],
    },
    {
      id: "tv4",
      name: "Chernobyl",
      poster_path: "/placeholder.svg?height=300&width=200",
      backdrop_path: "/placeholder.svg?height=780&width=1280",
      overview:
        "In April 1986, an explosion at the Chernobyl nuclear power plant in the Union of Soviet Socialist Republics becomes one of the world's worst man-made catastrophes.",
      first_air_date: "2019-05-06",
      vote_average: 9.4,
      genres: [
        { id: 18, name: "Drama" },
        { id: 36, name: "History" },
      ],
    },
    {
      id: "tv5",
      name: "Sherlock",
      poster_path: "/placeholder.svg?height=300&width=200",
      backdrop_path: "/placeholder.svg?height=780&width=1280",
      overview: "A modern update finds the famous sleuth and his doctor partner solving crime in 21st century London.",
      first_air_date: "2010-07-25",
      vote_average: 9.1,
      genres: [
        { id: 80, name: "Crime" },
        { id: 18, name: "Drama" },
      ],
    },
  ]

  // If an ID is provided, return a single TV show
  if (id) {
    const tvShow = tvShows.find((tv) => tv.id === id) || tvShows[0]
    return {
      ...tvShow,
      status: "Ended",
      tagline: "Winter is coming.",
      type: "Scripted",
      number_of_seasons: 8,
      number_of_episodes: 73,
      episode_run_time: [60],
      networks: [
        {
          id: 1,
          name: "HBO",
          logo_path: "/placeholder.svg?height=50&width=100",
        },
      ],
      seasons: [
        {
          id: "s1",
          name: "Season 1",
          overview: "First season overview.",
          poster_path: "/placeholder.svg?height=300&width=200",
          season_number: 1,
          episode_count: 10,
          air_date: "2011-04-17",
        },
        {
          id: "s2",
          name: "Season 2",
          overview: "Second season overview.",
          poster_path: "/placeholder.svg?height=300&width=200",
          season_number: 2,
          episode_count: 10,
          air_date: "2012-04-01",
        },
      ],
      videos: {
        results: [
          {
            id: "v1",
            key: "KPLWWIOCOOQ",
            name: "Trailer",
            site: "YouTube",
            type: "Trailer",
          },
        ],
      },
      credits: {
        cast: [
          {
            id: "c1",
            name: "Actor Name",
            character: "Character Name",
            profile_path: "/placeholder.svg?height=100&width=100",
          },
        ],
        crew: [
          {
            id: "cr1",
            name: "Creator Name",
            job: "Creator",
            profile_path: "/placeholder.svg?height=100&width=100",
          },
        ],
      },
    }
  }

  return tvShows
}
