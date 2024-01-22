import Row from "@/components/Row";
import TvMoviePage from "@/components/TvMoviePage";
import { requests, tmdbBaseUrl } from "@/lib/tmdb";

const page = async () => {
    return (
        <div style={{padding: "0 0 0 2vw",  marginTop:"2rem"}}>
            <Row mediaType={"movie"} title={"Now Playing"} fetchUrl={`${tmdbBaseUrl}/movie${requests.nowPlaying}`} />
            <Row mediaType={"movie"} title={"Popular"} fetchUrl={`${tmdbBaseUrl}/movie${requests.popular}`} />
            <Row mediaType={"movie"} title={"Top Rated"} fetchUrl={`${tmdbBaseUrl}/movie${requests.topRated}`} />
            <Row mediaType={"movie"} title={"Upcoming"} fetchUrl={`${tmdbBaseUrl}/movie${requests.upcoming}`} />
            <TvMoviePage type={"movie"} />
        </div>
    )
}

export default page
