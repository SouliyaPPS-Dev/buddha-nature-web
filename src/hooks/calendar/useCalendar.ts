import { useSearchContext } from "@/components/search/SearchContext";
import { CalendarDataModel } from "@/model/calendar";
import { calendarApi } from "@/services/https/calendar";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useCalendar = () => {
     const { searchTerm, setSearchTerm } = useSearchContext();

     const { data, isLoading, refetch } = useQuery({
          queryKey: ['calendar'],
          staleTime: 1,
          queryFn: async () => calendarApi(),
     });

     const filteredData = useMemo(() => {
          if (!data) return []; // Handle null or undefined `data`

          const normalizedSearchTerm =
               typeof searchTerm === 'string' ? searchTerm.toLowerCase() : '';

          return data.filter((item: CalendarDataModel) => {
               const matchesSearch =
                    !normalizedSearchTerm || // If no search term, all items match
                    [item['title'], item['details'], item['startDateTime'], item['endDateTime']]
                         .join(' ')
                         .toLowerCase()
                         .includes(normalizedSearchTerm);
               return matchesSearch;
          });
     }, [data, searchTerm]); // Dependencies are data, searchTerm, and selectedCategory


     return {
          // Data
          data: filteredData,
          isLoading,
          refetch,

          // Search
          searchTerm,
          setSearchTerm
     };
};