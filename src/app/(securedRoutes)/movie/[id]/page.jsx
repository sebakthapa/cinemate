import { tmdbBaseUrl, tmdbImageBaseUrl } from "@/lib/tmdb";
import MovieDetails from "@/components/MovieDetails"
import { minuteToHour } from "@/lib";


const fetchData = async (url) => {
  const res = await fetch(url, {
    cache: "force-cache",
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer 314c36b6995f6489ef35b3322ad7a190'
    }
  });
  https://api.themoviedb.org/3/movie/movie_id?language=en-US

  return await res.json();
}



const page = async ({ params }) => {
  const id = params?.id;

  const movieData = id && await fetchData(`${tmdbBaseUrl}/movie/${id}?language=en-US&api_key=314c36b6995f6489ef35b3322ad7a190`);

  const videosData = id && await fetchData(`${tmdbBaseUrl}/movie/${id}/videos?language=en-US&api_key=314c36b6995f6489ef35b3322ad7a190`)
  // console.log(videosData)
  const starrings = id && await fetchData(`${tmdbBaseUrl}/movie/${id}/credits?language=en-US&api_key=314c36b6995f6489ef35b3322ad7a190`)
  // console.log("starrings: ", starrings.cast)

  const similarMoviesUrl = `${tmdbBaseUrl}/movie/${id}/similar?language=en-US`;

  console.log(movieData)
  const { adult, title, genres, backdrop_path, poster_path, homepage, original_title, overview, popularity, production_companies, production_countries, release_date, spoken_language, runtime, vote_average, status, tagline, vote_count } = movieData

  const { hour, minutes } = minuteToHour(runtime);

  return (
    <div>
      <MovieDetails
        test={movieData}
        movieId={id}
        title={title}
        image={`${tmdbImageBaseUrl}/w780${poster_path}`}
        releaseDate={release_date}
        duration={`${hour}h ${minutes}min`}
        overview={overview}
        genres={genres}
        similarMoviesUrl={similarMoviesUrl}
        rating={vote_average}
        adult={adult}
        videos={videosData.results}
        tagline={tagline}
        starrings={starrings.cast}
        production_companies={production_companies}
        recommendationUrl={`https://api.themoviedb.org/3/movie/${id}/recommendations?language=en-US&page=1`}
      />

    </div>
  )
}

export default page
