"use client"

import styles from "./css/row.module.css"
import { tmdbImageBaseUrl } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";





const Row = ({ title, fetchUrl, fetchedData, mediaType }) => {
    const profile = useSelector((state) => state.profile)
    const [data, setData] = useState([])
    const [lastFetchedPage, setLastFetchedPage] = useState();
    const [currentPage, setCurrentPage] = useState(1)

    const totalPages = 10;
    const type = fetchUrl?.includes("/tv") ? "tv" : "movie";

    const fetchData = async () => {
        try {
            const res = await fetch(`${fetchUrl}&page=${currentPage}&include_adult=${!profile.isKid}&api_key=314c36b6995f6489ef35b3322ad7a190`, {
                method: "GET",
                headers: {
                    accept: 'application/json',
                    Authorization: 'Bearer 314c36b6995f6489ef35b3322ad7a190'
                }
            });
            if (res.status == 200) {
                const lists = await res.json();
                console.log(lists.results);

                // Check if the current page is the same as the last fetched page
                if (currentPage != lastFetchedPage) {
                    setData(prevData => [...prevData, ...lists.results]);
                    setLastFetchedPage(currentPage); // Update the last fetched page
                }

            } else {
                // alert("unable to get data")

            }
        } catch (error) {
            throw error;
        }



    }


    // useEffect(() => {
    //     fetchData()
    // }, [])

    const handleScroll = (e) => {
        if (currentPage < totalPages) {
            const { scrollLeft, scrollWidth } = e.target;
            const scrollPercentage = scrollLeft / scrollWidth * 100;

            if (scrollPercentage > 60) {
                setCurrentPage((prev) => prev + 1)
            }
        }
    }

    useEffect(() => {
        if (fetchUrl) {
            fetchData();
            console.log("rw data", data)
        } else {
            console.log("fetchedData,", fetchedData)
        }
    }, [currentPage])


    return (
        <>
            {
                data?.length > 0 && (
                    <div className={styles.row}>
                        <h2 className={styles.rowTitle}>{title}</h2>
                        <div onScroll={handleScroll} className={styles.container}>
                            {
                                data?.length > 0 && data?.map(({ title, poster_path, id, media_type }, idx) => {
                                    !poster_path && "";

                                    return (
                                        poster_path && <MovieCard key={idx} image={`${tmdbImageBaseUrl}/w185/${poster_path}`} link={`/${media_type || mediaType}/${id}`} title={title} />
                                    )
                                })
                            }
                            {
                                currentPage !== totalPages && (
                                    <h1 className={``}> loading...</h1>
                                )
                            }
                        </div>

                    </div>
                )
            }

        </>
    )
}

export default Row
