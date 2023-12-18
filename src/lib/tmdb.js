import axios from "axios"

export const requests = {
  popular: '/popular?language=en-US',
  topRated: '/top_rated?language=en-US',
  weeklyTrending: `/trending/all/week?api_key=${process.env.TMDB_API_KEY}&language=en-US`,
  dailyTrending: `/trending/all/day?api_key=${process.env.TMDB_API_KEY}&language=en-US`,
  trendingMovies: `/trending/movie/week?api_key=${process.env.TMDB_API_KEY}&language=en-US`,
  trendingShows: `/trending/tv/week?api_key=${process.env.TMDB_API_KEY}&language=en-US`,

  // only movies
  nowPlaying: `/now_playing?language=en-US`,
  upcoming: '/upcoming?language=en-US',


  // only tv shows
  airingToday: `/airing_today?language=en-US`,
  onTheAir: `/on_the_air?language=en-US`,  

}

export const tmdbBaseUrl = "https://api.themoviedb.org/3";
export const tmdbImageBaseUrl = "http://image.tmdb.org/t/p/"


// https://api.themoviedb.org/3/trending/all/week?language=en-US&api_key=66368903cda0d5cb27c63b040754b459


const movieGenres = [// 19

  {
    "id": 28,
    "name": "Action"
  },
  {
    "id": 12,
    "name": "Adventure"
  },
  {
    "id": 16,
    "name": "Animation"
  },
  {
    "id": 35,
    "name": "Comedy"
  },
  {
    "id": 80,
    "name": "Crime"
  },
  {
    "id": 99,
    "name": "Documentary"
  },
  {
    "id": 18,
    "name": "Drama"
  },
  {
    "id": 10751,
    "name": "Family"
  },
  {
    "id": 14,
    "name": "Fantasy"
  },
  {
    "id": 36,
    "name": "History"
  },
  {
    "id": 27,
    "name": "Horror"
  },
  {
    "id": 10402,
    "name": "Music"
  },
  {
    "id": 9648,
    "name": "Mystery"
  },
  {
    "id": 10749,
    "name": "Romance"
  },
  {
    "id": 878,
    "name": "Science Fiction"
  },
  {
    "id": 10770,
    "name": "TV Movie"
  },
  {
    "id": 53,
    "name": "Thriller"
  },
  {
    "id": 10752,
    "name": "War"
  },
  {
    "id": 37,
    "name": "Western"
  }
]

const tvGenre = [ //16
  {
    "id": 10759,
    "name": "Action & Adventure"
  },
  {
    "id": 16,
    "name": "Animation"
  },
  {
    "id": 35,
    "name": "Comedy"
  },
  {
    "id": 80,
    "name": "Crime"
  },
  {
    "id": 99,
    "name": "Documentary"
  },
  {
    "id": 18,
    "name": "Drama"
  },
  {
    "id": 10751,
    "name": "Family"
  },
  {
    "id": 10762,
    "name": "Kids"
  },
  {
    "id": 9648,
    "name": "Mystery"
  },
  {
    "id": 10763,
    "name": "News"
  },
  {
    "id": 10764,
    "name": "Reality"
  },
  {
    "id": 10765,
    "name": "Sci-Fi & Fantasy"
  },
  {
    "id": 10766,
    "name": "Soap"
  },
  {
    "id": 10767,
    "name": "Talk"
  },
  {
    "id": 10768,
    "name": "War & Politics"
  },
  {
    "id": 37,
    "name": "Western"
  }
]


export const fetchGenre = async (category, isKid) => {
  try {
    const res = await axios.get(`https://api.themoviedb.org/3/genre/${category}/list?language=en-US&include_adult=${!isKid}&api_key=${process.env.TMDB_API_KEY}`,
    {
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer 314c36b6995f6489ef35b3322ad7a190'
      }
    });
  return res.data.genres
  } catch (error) {
    console.log(error)
    throw error
  }
  
}
