import Row from '@/components/Row';
import TvMoviePage from '@/components/TvMoviePage';
import { requests, tmdbBaseUrl } from '@/lib/tmdb';

const page = () => {
  return (
    <div style={{ padding: '0 0 0 2vw', marginTop: '2rem' }}>
      <Row mediaType={'tv'} title={'Airing Today'} fetchUrl={`${tmdbBaseUrl}/tv${requests.airingToday}`} />
      {/* <Row title={"on the air"} fetchUrl={`${tmdbBaseUrl}/tv${requests.onTheAir}`} /> */}
      <Row mediaType={'tv'} title={'Top Rated'} fetchUrl={`${tmdbBaseUrl}/tv${requests.topRated}`} />
      <Row mediaType={'tv'} title={'popular'} fetchUrl={`${tmdbBaseUrl}/tv${requests.popular}`} />
      <TvMoviePage type={'tv'} />
    </div>
  );
};

export default page;
