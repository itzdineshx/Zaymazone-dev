import { useState, useEffect, useRef, useCallback } from 'react';

export interface TouchInteractionConfig {
  onLongPress?: () => void;
  onDoubleTap?: () => void;
  onTap?: () => void;
  longPressDelay?: number;
  doubleTapDelay?: number;
  hapticFeedback?: boolean;
}

export const useTouchInteraction = (config: TouchInteractionConfig = {}) => {
  const {
    onLongPress,
    onDoubleTap,
    onTap,
    longPressDelay = 500,
    doubleTapDelay = 300,
    hapticFeedback = true
  } = config;

  const [lastTap, setLastTap] = useState<number>(0);
  const longPressTimerRef = useRef<NodeJS.Timeout>();
  const tapCountRef = useRef<number>(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTap;

    // Handle double tap
    if (timeSinceLastTap < doubleTapDelay) {
      tapCountRef.current += 1;
      if (tapCountRef.current === 2) {
        onDoubleTap?.();
        if (hapticFeedback && navigator.vibrate) {
          navigator.vibrate([50, 50, 50]);
        }
        tapCountRef.current = 0;
        return;
      }
    } else {
      tapCountRef.current = 1;
    }

    setLastTap(now);

    // Start long press timer
    longPressTimerRef.current = setTimeout(() => {
      onLongPress?.();
      if (hapticFeedback && navigator.vibrate) {
        navigator.vibrate(100);
      }
    }, longPressDelay);
  }, [lastTap, doubleTapDelay, longPressDelay, onLongPress, onDoubleTap, hapticFeedback]);

  const handleTouchEnd = useCallback(() => {
    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }

    // Handle single tap after double tap delay
    setTimeout(() => {
      if (tapCountRef.current === 1) {
        onTap?.();
        if (hapticFeedback && navigator.vibrate) {
          navigator.vibrate(25);
        }
      }
      tapCountRef.current = 0;
    }, doubleTapDelay);
  }, [doubleTapDelay, onTap, hapticFeedback]);

  const handleTouchMove = useCallback(() => {
    // Cancel long press if user moves finger
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchMove: handleTouchMove,
  };
};