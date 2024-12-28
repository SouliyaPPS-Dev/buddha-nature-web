import { useState, useEffect, useCallback } from 'react';
import { useSutra } from './useSutra';
import { toast } from 'react-toastify';
import { clearCache } from '@/services/cache';
import { useBook } from '@/hooks/book/useBook';

const LAST_UPDATE_KEY = 'LAST_SUTRA_UPDATE';
// const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const ONE_MONTH_IN_MS = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
// const ONE_YEAR_IN_MS = 365 * 24 * 60 * 60 * 1000; // 365 days in milliseconds


// Singleton to ensure `handleUpdate` runs once globally
let isUpdating = false;

export const useUpdateSutraData = () => {
     const [isLoading, setIsLoading] = useState(false);
     const { isLoading: isLoadingSutra, refetch: refetchSutra } = useSutra();
     const { refetch: refetchBook } = useBook();

     const refetch = useCallback(async () => {
          await Promise.all([refetchSutra(), refetchBook()]);    
     }, [refetchSutra, refetchBook]);
     
     /**
      * Check if 24 hours have passed since the last update
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
               localStorage.removeItem('LAST_SUTRA_UPDATE');
               localStorage.removeItem('REACT_QUERY_OFFLINE_CACHE');
               localStorage.removeItem('theme');

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
      * Run update only if 24 hours have passed since the last update
      */
     useEffect(() => {
          if (shouldUpdate()) {
               handleUpdate();
          }
     }, [shouldUpdate, handleUpdate]);

     return {
          isLoading: isLoading || isLoadingSutra,
          handleUpdate,
     };
};