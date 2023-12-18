import styles from "./css/home.module.css"
import Header from '@/components/Header'
import Row from './Row'
import { requests, tmdbBaseUrl } from "@/lib/tmdb"


function Home() {

    return (
        <div style={{padding: "0 2rem", marginTop:"2rem"}}>
            {/* <div className={styles.bdy}> */}
                <Row title="Today's Hits" fetchUrl={`${tmdbBaseUrl}${requests.dailyTrending}`} />
                <Row title="trending movies" fetchUrl={`${tmdbBaseUrl}${requests.trendingMovies}`} />
                <Row title="trending shows" fetchUrl={`${tmdbBaseUrl}${requests.trendingShows}`} />
            {/* </div> */}



        </div>
    )
}

export default Home
