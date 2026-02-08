import { useState, useEffect, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  threshold?: number;
}

export const useInfiniteScroll = ({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  threshold = 200
}: UseInfiniteScrollOptions) => {
  const [isFetching, setIsFetching] = useState(false);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - threshold
    ) {
      if (hasNextPage && !isFetchingNextPage && !isFetching) {
        setIsFetching(true);
        fetchNextPage();
      }
    }
  }, [hasNextPage, isFetchingNextPage, isFetching, fetchNextPage, threshold]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (!isFetchingNextPage) {
      setIsFetching(false);
    }
  }, [isFetchingNextPage]);

  return { isFetching };
};