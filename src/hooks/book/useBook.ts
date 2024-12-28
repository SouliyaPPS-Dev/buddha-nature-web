import { useSearchContext } from "@/components/search/SearchContext";
import { BookDataModel } from "@/model/book";
import { bookApi } from "@/services/https/book";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

export const useBook = () => {
     const { searchTerm, setSearchTerm } = useSearchContext();
     const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // State for filtering by category

     const { data, isLoading, refetch } = useQuery({
          queryKey: ['book'],
          queryFn: async () => bookApi(),
     });

     const filteredData = useMemo(() => {
          if (!data) return []; // Handle null or undefined `data`

          const normalizedSearchTerm =
               typeof searchTerm === 'string' ? searchTerm.toLowerCase() : '';

          return data.filter((item: BookDataModel) => {
               const matchesCategory =
                    !selectedCategory || item['ໝວດຟາຍ'] === selectedCategory; // Filter based on category
               const matchesSearch =
                    !normalizedSearchTerm || // If no search term, all items match
                    [item['ຊື່'], item['ໝວດຟາຍ'], item['ໝວດທັມ']]
                         .join(' ')
                         .toLowerCase()
                         .includes(normalizedSearchTerm);
               return matchesCategory && matchesSearch;
          });
     }, [data, searchTerm, selectedCategory]); // Dependencies are data, searchTerm, and selectedCategory

     // Derive unique categories for the dropdown from `data`
     const uniqueCategories = Array.from(
          new Set(data?.map((item: BookDataModel) => item['ໝວດຟາຍ']).filter(Boolean))
     ) as any;


     return {
          // Data
          data: filteredData,
          isLoading,
          refetch,

          // Search
          searchTerm,
          setSearchTerm,

          // Filter
          selectedCategory,
          setSelectedCategory,
          uniqueCategories
     }
}