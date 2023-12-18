"use client"
import { FaStar } from "react-icons/fa"
import styles from "./css/movieDetails.module.css"
import { Tab, TabsContainer } from "./Tab"
import Image from "next/image"
import Row from "./Row"
import YoutubeVideoRow from "./YoutubeVideoRow"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

const MovieDetails = ({ title, production_companies, starrings, tagline, image, releaseDate, duration, overview, genres, similarMoviesUrl, lastReleasedEpisode, rating, adult, videos, movieId, recommendationUrl, seasons, seasonCount, episodeCount, createdBy }) => {
    console.log(seasons)

    const pathname = usePathname();
    const [mediaType, setMediaType] = useState("")


    const videoTypes = [];

    console.log(videos)
    videos?.length > 0 && videos.map(({ type }) => !videoTypes.includes(type) && videoTypes.push(type))
    console.log(videoTypes)
    console.log("videos", videos)
    useEffect(() => {
        const media = pathname.includes("tv") ? "tv" : "movie"
        setMediaType(media)

    }, [pathname])
    return (
        <div className={styles.movieDetails}>
            <div className={styles.image}>
                <Image priority src={image} width="500" height="900" alt={`${title} poster`} />
            </div>
            <div className={styles.contents}>
                <div className={styles.header}>
                    <div className={styles.left}>
                        <h1 className={styles.title}>{title}</h1>
                        <div className={styles.subtitles}>
                            <p className={styles.year}>{releaseDate?.split("-")[0]}{lastReleasedEpisode && " - " + lastReleasedEpisode?.air_date.split("-")[0]}</p>
                            {
                                duration ? <p className={styles.duration}>{duration}</p> :
                                    <p className="seasonCount"> {`${seasonCount} seasons - ${episodeCount} eps`}</p>
                            }

                            <p className={styles.age}>{adult ? "18+" : "12+"}</p>
                        </div>
                    </div>
                    <div className={styles.right}>
                        <p className={styles.rating}>
                            <span>
                                {rating?.toFixed(1)}
                            </span>
                            <FaStar />
                        </p>
                    </div>
                </div>

                <div className={styles.details}>
                    <TabsContainer tabs={["overview", "trailers & more", "more like this", "details"]} >
                        <Tab for="overview">
                            <div className={styles.overview}>
                                <div className={styles.descContainer}>
                                    <div className={styles.mobileImage}>
                                        <Image priority src={image} width="200" height="300" alt={`${title} poster`} />
                                    </div>
                                    <div className={styles.description}>
                                        {overview}
                                    </div>
                                </div>


                                <table className={styles.list}>
                                    <tbody>

                                        <tr>
                                            <th>Starring: </th>
                                            <td>
                                                {
                                                    starrings?.length > 0 && starrings.map((star, idx, array) => {
                                                        if (idx > 3) return;
                                                        if (idx > 2) return "..."

                                                        return (idx == (array.length - 1) ? star.name : `${star.original_name}, `)
                                                    }
                                                    )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Created by: </th>
                                            <td>
                                                {
                                                    createdBy ?
                                                        createdBy?.length > 0 && createdBy.map((creator, idx, array) => {
                                                            if (idx > 3) return;
                                                            if (idx > 2) return "..."
                                                            return (idx == (array.length - 1) ? creator.name : `${creator.name}, `)
                                                        }
                                                        )
                                                        :
                                                        production_companies?.length > 0 && production_companies.map((comp, idx, array) => {
                                                            if (idx > 3) return;
                                                            if (idx > 2) return "..."
                                                            return (idx == (array.length - 1) ? comp.name : `${comp.name}, `)
                                                        }
                                                        )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Genres: </th>
                                            <td>
                                                {
                                                    genres?.length > 0 && genres.map((genre, idx, array) => idx == (array.length - 1) ? genre.name : `${genre.name}, `
                                                    )}
                                            </td>
                                        </tr>
                                    </tbody>

                                </table>

                                {/* {seasons?.length > 0 && (
                                    <div className={""}>
                                        <h4 className="">All Seasons</h4>
                                        <Row  fetchedData={seasons}  />
                                    </div>
                                )} */}


                                <div className={styles.similarMovies}>
                                    <h4 className="">similar {mediaType}s</h4>

                                    <Row mediaType={mediaType} fetchUrl={similarMoviesUrl} title={""} />
                                </div>
                            </div>

                        </Tab>

                        <Tab for="trailers & more">
                            <div className={styles.trailers}>
                                <YoutubeVideoRow videos={videos} title={""} />
                            </div>
                        </Tab>

                        <Tab for="more like this">
                            <Row fetchUrl={recommendationUrl} />
                        </Tab>

                        <Tab for="details">
                            <div className="top" style={{ margin: "1rem", opacity: ".8" }}>
                                {/* Title: {title}
                                Tagline : {tagline} */}
                                This tab is under development and will be integrated soon.
                            </div>
                        </Tab>
                    </TabsContainer>
                </div>
            </div>
        </div>
    )
}

export default MovieDetails
