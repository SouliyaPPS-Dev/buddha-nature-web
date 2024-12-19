import { useState } from "react";
import { useSutra } from "./useSutra";
import { toast } from "react-toastify";

export const useUpdateSutraData = () => {
     const [isLoading, setIsLoading] = useState(false);

     const { isLoading: isLoadingSutra, refetch } = useSutra();

     const handleUpdate = async () => {
          setIsLoading(true);

          try {
               // Remove cached data from localStorage
               localStorage.removeItem('REACT_QUERY_OFFLINE_CACHE');

               // Clear sessionStorage
               sessionStorage.clear();

               // Refetch the data after update
               await refetch();

               // Simulate a data update (replace with actual update logic)
               await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate 2-second wait

               if (!isLoadingSutra) {
                    // Show success toast message after data is updated
                    toast.success('Data updated successfully!', {
                         position: 'top-right',
                         autoClose: 2000,
                    });
               }
          } catch (error) {
               // Handle errors with a more informative message
               toast.error('Failed to update data. Please try again later.', {
                    position: 'top-right',
                    autoClose: 2000,
               });
               console.error('Error updating data:', error); // Log error for debugging
          } finally {
               // Always stop loading state, even if there was an error
               setIsLoading(false);
          }
     };
     return {
          isLoading,
          handleUpdate
     }
}