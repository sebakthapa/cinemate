"use client"
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import styles from "./css/search.module.css";
import { useState } from 'react';
import { FaSearch, FaStar } from 'react-icons/fa';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { movieGenres, tmdbImageBaseUrl, tvGenre } from '@/lib/tmdb';
import Link from 'next/link';

const Search = ({ searchText: searchedText }) => {
    const { data, isLoading, loadMore, isLoadingNewPage, hasMore, error } = useInfiniteScroll({ url: `/api/tmdb/search/${decodeURI(searchedText)}?includeAdult=${true}` })

    console.log(data)
    const pathname = usePathname()
    const router = useRouter()

    const [searchText, setSearchText] = useState(decodeURI(searchedText));

    const handleSearch = async (e) => {
        e.preventDefault();
        console.log(searchText)
        const filteredText = searchText.replaceAll("  ", "");
        if (filteredText && filteredText != " ") {
            router.push(`/search/${filteredText}`)
        }
    }


    return (
        <div className={styles.search}>
            <form onSubmit={handleSearch} className={styles.searchInput}>
                <input autoFocus={pathname.split("/").at(-1) == "search" ? true : false} placeholder='Search...' type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                <button><FaSearch /></button>
            </form >

            <main className="resultContainer">
                {
                    !data || data?.length == 0 && (
                        <div className={styles.emptyMessage}>
                            {
                                isLoading ? "Searching ... " : "Oops! I am empty."
                            }
                        </div>
                    )
                }

                <div className={styles.cardsContainer}>
                    {
                        data && data.length > 0 && data?.map(({ name, title, id, backdrop_path, overview, media_type, poster_path, genre_ids, popularity, vote_average, release_date, first_air_date, original_language }, idx) => {
                            console.log(backdrop_path)
                            let genreIds = genre_ids;
                            return (
                                <Link href={`/${media_type}/${id}`} key={id} className={styles.card}>
                                    <div className={styles.left}>
                                        <div className={styles.topLeft}>
                                            <Image src={`${tmdbImageBaseUrl}/w92/${poster_path}`} alt={`${name || title} photo`} width={92} height={138} />
                                            <div>
                                                <h5 className={styles.cardName}>{name || title}</h5>
                                                <p className={styles.releaseDate}>{release_date?.split("-")[0] || first_air_date?.split("-")[0]}, {media_type}</p>

                                                <p className={styles.genre}>
                                                    {
                                                        movieGenres.map(({ id, name }) => {
                                                            if (genreIds.includes(id)) {
                                                                genreIds = genreIds.filter((gen) => gen != id)

                                                                return genreIds.length > 0 ? `${name}, ` : name
                                                            }
                                                        })
                                                    }
                                                    {
                                                        tvGenre.map(({ id, name }) => {
                                                            if (genreIds.includes(id)) {
                                                                genreIds = genreIds.filter((gen) => gen != id)

                                                                return genreIds.length > 0 ? `${name}, ` : name
                                                            }
                                                        })
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        <div className={styles.bottomLeft}>
                                            <p className={styles.cardOverview}>{overview}</p>

                                            <p className={styles.rating}>
                                                <FaStar />
                                                {vote_average?.toFixed(1)}
                                            </p>
                                        </div>

                                    </div>
                                    <div className={styles.right}>
                                        <Image src={`${tmdbImageBaseUrl}/w300/${backdrop_path}`} alt={`${name || title} photo`} width={300} height={169} />
                                    </div>

                                </Link>
                            )
                        })
                    }
                </div>

            </main>

        </div>
    )
}

export default Search
