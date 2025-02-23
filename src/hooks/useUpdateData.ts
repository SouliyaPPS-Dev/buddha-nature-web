import { useState, useEffect, useCallback } from 'react';
import { useSutra } from './sutra/useSutra';
import { toast } from 'react-toastify';
import { clearCache } from '@/services/cache';
import { useBook } from '@/hooks/book/useBook';
import useVideo from './video/useVideo';

const LAST_UPDATE_KEY = 'LAST_SUTRA_UPDATE';
const ONE_MONTH_IN_MS = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

// Singleton to ensure `handleUpdate` runs once globally
let isUpdating = false;

export const useUpdateData = () => {
     const [isLoading, setIsLoading] = useState(false);
     const { isLoading: isLoadingSutra, refetch: refetchSutra } = useSutra();
     const { refetch: refetchBook } = useBook();
     const { refetch: refetchVideo } = useVideo();

     const refetch = useCallback(async () => {
          await Promise.all([refetchSutra(), refetchBook(), refetchVideo()]);
     }, [refetchSutra, refetchBook, refetchVideo]);

     /**
      * Check if a month has passed since the last update
      */
     const shouldUpdate = useCallback((): boolean => {
          const lastUpdate = localStorage.getItem(LAST_UPDATE_KEY);
          if (!lastUpdate) return true; // No previous record, proceed with the update

          const lastUpdateTime = new Date(lastUpdate).getTime();
          const currentTime = Date.now();

          return currentTime - lastUpdateTime > ONE_MONTH_IN_MS;
     }, []);

     /**
      * Handle Data Update
      */
     const handleUpdate = useCallback(async () => {
          if (isUpdating) return; // Prevent multiple calls

          isUpdating = true;
          setIsLoading(true);

          try {
               // Clear cached data
               localStorage.removeItem(LAST_UPDATE_KEY);
               localStorage.removeItem('REACT_QUERY_OFFLINE_CACHE');
               localStorage.removeItem('theme');
               localStorage.removeItem('navigation_history');

               await clearCache();

               // Refetch data
               await refetch();

               // Simulate a slight delay (e.g., network request)
               await new Promise((resolve) => setTimeout(resolve, 1000));

               // Save the current timestamp
               localStorage.setItem(LAST_UPDATE_KEY, new Date().toISOString());

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

     /**
      * Run update automatically only if online and a month has passed
      */
     useEffect(() => {
          const isOnline = navigator.onLine; // Check online status
          if (isOnline && shouldUpdate()) {
               handleUpdate();
          }
          // No cleanup or listener needed since this runs once on mount
     }, [shouldUpdate, handleUpdate]);

     return {
          isLoading: isLoading || isLoadingSutra,
          handleUpdate,
     };
};