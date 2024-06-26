/* eslint-disable camelcase */
import { tmdbBaseUrl, tmdbImageBaseUrl } from '@/lib/tmdb';
import MovieDetails from '@/components/MovieDetails';
// import { minuteToHour } from '@/lib';

const fetchData = async (url) => {
  const res = await fetch(`${url}&api_key=${process.env.TMDB_API_KEY}`, {
    cache: 'force-cache',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    },
  });

  return res.json();
};

const page = async ({ params }) => {
  const id = params?.id;

  const tvData =
    id && (await fetchData(`${tmdbBaseUrl}/tv/${id}?language=en-US`));
  const videosData =
    id && (await fetchData(`${tmdbBaseUrl}/tv/${id}/videos?language=en-US`));

  const similarMoviesUrl = `${tmdbBaseUrl}/tv/${id}/similar?language=en-US`;

  const {
    adult,
    name,
    genres,
    // backdrop_path,
    poster_path,
    // homepage,
    // original_title,
    overview,
    // popularity,
    // production_companies,
    created_by,
    // production_countries,
    first_air_date,
    // spoken_language,
    // runtime,
    vote_average,
    // status,
    tagline,
    // vote_count,
    seasons,
    number_of_seasons,
    number_of_episodes,
    last_episode_to_air,
  } = tvData;
  // const { hour, minutes } = minuteToHour(runtime);

  const starrings =
    id && (await fetchData(`${tmdbBaseUrl}/tv/${id}/credits?language=en-US`));

  return (
    <div>
      <MovieDetails
        movieId={id}
        title={name}
        image={`${tmdbImageBaseUrl}/w780${poster_path}`}
        releaseDate={first_air_date}
        lastReleasedEpisode={last_episode_to_air}
        overview={overview}
        genres={genres}
        similarMoviesUrl={similarMoviesUrl}
        rating={vote_average}
        adult={adult}
        videos={videosData.results}
        tagline={tagline}
        seasons={seasons}
        seasonCount={number_of_seasons}
        episodeCount={number_of_episodes}
        createdBy={created_by}
        recommendationUrl={`https://api.themoviedb.org/3/tv/${id}/recommendations?language=en-US&page=1`}
        starrings={starrings.cast}
      />
    </div>
  );
};

export default page;
