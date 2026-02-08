import { useState, useEffect } from 'react';

export interface SwipeConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  minSwipeDistance?: number;
  maxSwipeTime?: number;
}

export const useSwipe = (config: SwipeConfig = {}) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    minSwipeDistance = 50,
    maxSwipeTime = 300
  } = config;

  const [touchStart, setTouchStart] = useState<{ x: number; y: number; time: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number; time: number } | null>(null);

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    setTouchEnd(null);
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    });
  };

  const handleTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0];
    setTouchEnd({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const timeDiff = touchEnd.time - touchStart.time;

    const isValidSwipe = timeDiff < maxSwipeTime && (
      Math.abs(distanceX) > minSwipeDistance || Math.abs(distanceY) > minSwipeDistance
    );

    if (!isValidSwipe) return;

    // Determine swipe direction
    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      // Horizontal swipe
      if (distanceX > 0) {
        onSwipeLeft?.();
      } else {
        onSwipeRight?.();
      }
    } else {
      // Vertical swipe
      if (distanceY > 0) {
        onSwipeUp?.();
      } else {
        onSwipeDown?.();
      }
    }
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
};