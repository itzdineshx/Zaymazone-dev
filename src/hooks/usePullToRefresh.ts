import { useState, useRef, useCallback } from 'react';

export interface PullToRefreshConfig {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  maxPull?: number;
  disabled?: boolean;
}

export const usePullToRefresh = (config: PullToRefreshConfig) => {
  const { onRefresh, threshold = 80, maxPull = 120, disabled = false } = config;

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [startY, setStartY] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled || isRefreshing) return;
    setStartY(e.touches[0].clientY);
  }, [disabled, isRefreshing]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (disabled || isRefreshing || startY === null) return;

    const currentY = e.touches[0].clientY;
    const distance = currentY - startY;

    // Only allow pull down from top
    if (distance > 0 && (containerRef.current?.scrollTop || 0) === 0) {
      const clampedDistance = Math.min(distance * 0.5, maxPull);
      setPullDistance(clampedDistance);
    }
  }, [disabled, isRefreshing, startY, maxPull]);

  const handleTouchEnd = useCallback(async () => {
    if (disabled || isRefreshing || pullDistance === 0) return;

    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }

    setPullDistance(0);
    setStartY(null);
  }, [disabled, isRefreshing, pullDistance, threshold, onRefresh]);

  const getPullProgress = useCallback(() => {
    return Math.min(pullDistance / threshold, 1);
  }, [pullDistance, threshold]);

  const getTransform = useCallback(() => {
    return `translateY(${pullDistance}px)`;
  }, [pullDistance]);

  return {
    containerRef,
    isRefreshing,
    pullDistance,
    pullProgress: getPullProgress(),
    transform: getTransform(),
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
};