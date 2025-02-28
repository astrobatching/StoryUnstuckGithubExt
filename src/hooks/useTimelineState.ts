import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'timeline_state';
const DEFAULT_HEIGHT = 300;
const MIN_HEIGHT = 100;
const MAX_HEIGHT = window.innerHeight * 0.5;

interface TimelineState {
  height: number;
  isCollapsed: boolean;
}

export function useTimelineState() {
  const [state, setState] = useState<TimelineState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {
        height: DEFAULT_HEIGHT,
        isCollapsed: false
      };
    } catch {
      return {
        height: DEFAULT_HEIGHT,
        isCollapsed: false
      };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save timeline state:', error);
    }
  }, [state]);

  const setHeight = useCallback((height: number) => {
    const clampedHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, height));
    setState(prev => ({ ...prev, height: clampedHeight }));
  }, []);

  const toggleCollapsed = useCallback(() => {
    setState(prev => ({ ...prev, isCollapsed: !prev.isCollapsed }));
  }, []);

  return {
    height: state.height,
    isCollapsed: state.isCollapsed,
    minHeight: MIN_HEIGHT,
    maxHeight: MAX_HEIGHT,
    setHeight,
    toggleCollapsed
  };
}