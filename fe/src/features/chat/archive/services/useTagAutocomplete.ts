'use client';

import { useState, useEffect } from 'react';

export function useTagAutocomplete(input: string) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!input) return setSuggestions([]);

    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/v1/archive/tags/search?prefix=${input}`);
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error('태그 추천 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 200); // ⏱ debounce
    return () => clearTimeout(timeoutId);
  }, [input]);

  return { suggestions, loading };
}
