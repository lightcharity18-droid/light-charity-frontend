import { useCallback, useEffect, useRef, useState } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  hasMore: boolean;
  loading: boolean;
}

export function useInfiniteScroll(
  loadMore: () => void,
  options: UseInfiniteScrollOptions
) {
  const { threshold = 100, hasMore, loading } = options;
  const observerRef = useRef<HTMLDivElement>(null);
  const [isNearTop, setIsNearTop] = useState(false);

  const handleScroll = useCallback(() => {
    const element = observerRef.current?.parentElement;
    if (!element) return;

    const { scrollTop } = element;
    const nearTop = scrollTop < threshold;
    
    if (nearTop && !isNearTop && hasMore && !loading) {
      setIsNearTop(true);
      loadMore();
    } else if (!nearTop && isNearTop) {
      setIsNearTop(false);
    }
  }, [threshold, hasMore, loading, isNearTop, loadMore]);

  useEffect(() => {
    const element = observerRef.current?.parentElement;
    if (!element) return;

    element.addEventListener('scroll', handleScroll);
    return () => element.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return observerRef;
}
