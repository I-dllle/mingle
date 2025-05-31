'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/apiClient';
import { UserSimpleDto } from '@/features/user/search/types/UserSimpleDto';

export function useUserSearch(keyword: string) {
  const [results, setResults] = useState<UserSimpleDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!keyword || keyword.trim() === '') {
      setResults([]);
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiClient<UserSimpleDto[]>(
          `/api/v1/users/search?keyword=${encodeURIComponent(keyword)}`
        );
        setResults(data);
      } catch (err) {
        console.error(err);
        setError('유저 검색에 실패했습니다.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [keyword]);

  return { results, loading, error };
}
