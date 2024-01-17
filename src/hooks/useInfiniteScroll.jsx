import { useState, useEffect } from 'react';

const useInfiniteScroll = ({ url, data: localData = [], dependencies=[] }) => {
    const [data, setData] = useState(localData ? [...localData] : []);
    const [nextPage, setNextPage] = useState( 1);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingNewPage, setIsLoadingNewPage] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(false)
    const hasData = localData?.length > 0;
    let fetchedPage = 0 ;
    let isAddingData = false; //useState has slight delay in updating. That caused it to take time to setLoading(true) and setLoadingNewPage(true) to take time resulting multiple load data to be called on scroll.

    const handleScroll = () => {
        const scrollOffset = 800; // value above the end of scroll to start fetching new page
        if (document.documentElement.scrollHeight - (window.innerHeight + document.documentElement.scrollTop) < scrollOffset) {
            loadMore();
        }
    };

    const loadMore = async () => {

        if (isLoading || !hasMore || isLoadingNewPage || isAddingData || dependencies.some(dep => dep == undefined)) return;
        
        if (nextPage <= fetchedPage) {
            return;
        } 

        try {
            isAddingData = true;
            setIsLoadingNewPage(true)
            if (nextPage == 1) {
                setIsLoading(true)
            }

            const response = await fetch(`${url}&page=${nextPage}`);
            const newData = await response.json();
            console.log(newData)

            if (newData.page == newData.total_pages || newData.data?.length == 0) {
                setHasMore(false);
            }
            if (newData.page <= newData.total_pages) {
                setNextPage(newData.page + 1);
                setData((prevData) => [...prevData, ...newData.results]);
                fetchedPage = newData.page;
            }

        } catch (error) {
            console.error('Error fetching data for infiniteScroll:', error.message);
            setError("error")
            
        } finally {
            setIsLoading(false)
            setIsLoadingNewPage(false)
            isAddingData = false
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isLoading, hasMore, isLoadingNewPage, ...dependencies]);

    useEffect(() => {
        
        if (!hasData) {
            loadMore();
        }

    }, [...dependencies])

    return { data, isLoading, loadMore, isLoadingNewPage, hasMore, error };
};

export default useInfiniteScroll;
