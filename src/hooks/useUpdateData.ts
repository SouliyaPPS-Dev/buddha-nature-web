import { useBook } from '@/hooks/book/useBook';
import { clearCache } from '@/services/cache';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSutra } from './sutra/useSutra';

const LAST_UPDATE_KEY = 'LAST_SUTRA_UPDATE';

let isUpdating = false;

export const useUpdateData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { isLoading: isLoadingSutra, refetch: refetchSutra } = useSutra();
  const { refetch: refetchBook } = useBook();

  const refetch = useCallback(async () => {
    await Promise.all([refetchSutra(), refetchBook()]);
  }, [refetchSutra, refetchBook]);

  const handleUpdate = useCallback(async () => {
    if (isUpdating) return;
    isUpdating = true;
    setIsLoading(true);

    try {
      localStorage.removeItem(LAST_UPDATE_KEY);
      localStorage.removeItem('REACT_QUERY_OFFLINE_CACHE');
      localStorage.removeItem('theme');
      localStorage.removeItem('navigation_history');

      await clearCache();
      await refetch();

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Save today's date as update marker
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(LAST_UPDATE_KEY, today);

      toast.success('Data updated successfully!', {
        position: 'top-right',
        autoClose: 2000,
      });

    } catch (error) {
      toast.error('Failed to update data. Please try again later.', {
        position: 'top-right',
        autoClose: 2000,
      });
      console.error('Error updating data:', error);
    } finally {
      isUpdating = false;
      setIsLoading(false);
    }
  }, [refetch]);

  // Check if update should run
  useEffect(() => {
    const isOnline = navigator.onLine;
    const lastUpdate = localStorage.getItem(LAST_UPDATE_KEY);
    const today = new Date().toISOString().split('T')[0];

    if (isOnline && lastUpdate !== today) {
      handleUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  return {
    isLoading: isLoading || isLoadingSutra,
    handleUpdate,
  };
};