/* eslint-disable camelcase */
import { tmdbBaseUrl, tmdbImageBaseUrl } from '@/lib/tmdb';
import MovieDetails from '@/components/MovieDetails';
import { minuteToHour } from '@/lib';

const fetchData = async (url) => {
  const res = await fetch(`${url}&api_key=${process.env.TMDB_API_KEY}`, {
    cache: 'force-cache',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    },
  });
  // https://api.themoviedb.org/3/movie/movie_id?language=en-US

  return res.json();
};

const page = async ({ params }) => {
  const id = params?.id;

  const movieData =
    id && (await fetchData(`${tmdbBaseUrl}/movie/${id}?language=en-US`));

  const videosData =
    id && (await fetchData(`${tmdbBaseUrl}/movie/${id}/videos?language=en-US`));
  const starrings =
    id &&
    (await fetchData(`${tmdbBaseUrl}/movie/${id}/credits?language=en-US`));

  const similarMoviesUrl = `${tmdbBaseUrl}/movie/${id}/similar?language=en-US`;

  const {
    adult,
    title,
    genres,
    // backdrop_path,
    poster_path,
    // homepage,
    // original_title,
    overview,
    // popularity,
    production_companies,
    // production_countries,
    release_date,
    // spoken_language,
    runtime,
    vote_average,
    // status,
    tagline,
    // vote_count,
  } = movieData;

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
  );
};

export default page;
