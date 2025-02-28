import { useState, useEffect } from 'react';

interface HeaderData {
  id: string;
  title: string;
  subtitle: string;
}

const STORAGE_KEY = 'episode_headers';

export function useEpisodeHeaders() {
  const [headers, setHeaders] = useState<Record<string, HeaderData>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(headers));
    } catch (error) {
      console.error('Failed to save headers:', error);
    }
  }, [headers]);

  const updateHeader = (id: string, updates: Partial<HeaderData>) => {
    setHeaders(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...updates,
      }
    }));
  };

  return {
    headers,
    updateHeader,
  };
}