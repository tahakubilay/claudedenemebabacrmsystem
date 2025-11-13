import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { AxiosError } from 'axios';

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export function useApi<T>(
  endpoint: string | null,
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!endpoint) {
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<T | PaginatedResponse<T>>(endpoint);
      if ((response as PaginatedResponse<T>).results) {
        setData((response as PaginatedResponse<T>).results as T);
      } else {
        setData(response as T);
      }
    } catch (err) {
      const error = err as AxiosError;
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = () => fetchData();

  return { data, loading, error, refetch };
}