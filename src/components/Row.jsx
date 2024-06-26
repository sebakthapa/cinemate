'use client';

import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './css/row.module.css';
import { tmdbImageBaseUrl } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';

const Row = ({ title, fetchUrl, fetchedData, mediaType }) => {
  const profile = useSelector((state) => state.profile);
  const [data, setData] = useState([]);
  const [lastFetchedPage, setLastFetchedPage] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = 10;
  // const type = fetchUrl?.includes('/tv') ? 'tv' : 'movie';

  const fetchData = async () => {
    try {
      const res = await axios.post('/api/tmdb/rowdata', {
        fetchUrl,
        isKid: profile.isKid || false,
        currentPage,
      });
      // console.log(res)

      if (res.status === 200) {
        // Check if the current page is the same as the last fetched page

        if (currentPage !== lastFetchedPage) {
          setData((prevData) => [...prevData, ...res.data]);
          setLastFetchedPage(currentPage); // Update the last fetched page
        }
      } else {
        alert('unable to get data');
      }
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //     fetchData()
  // }, [])

  const handleScroll = (e) => {
    if (currentPage < totalPages) {
      const { scrollLeft, scrollWidth } = e.target;
      const scrollPercentage = (scrollLeft / scrollWidth) * 100;

      if (scrollPercentage > 60) {
        setCurrentPage((prev) => prev + 1);
      }
    }
  };

  useEffect(() => {
    if (fetchUrl) {
      fetchData();
    } else {
      console.log('fetchedData,', fetchedData);
    }
  }, [currentPage]);

  return (
    <>
      {data?.length > 0 && (
        <div className={styles.row}>
          <h2 className={styles.rowTitle}>{title}</h2>
          <div onScroll={handleScroll} className={styles.container}>
            {data?.length > 0 &&
              data?.map(({ name, poster_path: posterPath, id, media_type: thisMediaType }, idx) => {
                // console.log(thisMediaType, mediaType)
                !posterPath && '';

                return (
                  posterPath && (
                    <MovieCard
                      key={idx}
                      image={`${tmdbImageBaseUrl}/w185/${posterPath}`}
                      link={`/${thisMediaType || mediaType}/${id}`}
                      title={name}
                    />
                  )
                );
              })}
            {currentPage !== totalPages && <h1 className={``}> loading...</h1>}
          </div>
        </div>
      )}
    </>
  );
};

export default Row;
