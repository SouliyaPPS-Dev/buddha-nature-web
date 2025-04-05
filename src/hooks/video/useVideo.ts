import { useSearchContext } from '@/components/search/SearchContext';
import { VideoDataModel } from '@/model/video';
import { videoApi } from '@/services/https/video';
import { getStaleTime } from '@/services/react-query/client';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

export const useVideo = () => {
  const { searchTerm, setSearchTerm } = useSearchContext();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // State for filtering by category

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['video', searchTerm, selectedCategory],
    queryFn: async () => videoApi(),
    staleTime: getStaleTime(navigator.onLine),
    gcTime: getStaleTime(navigator.onLine),
    enabled: navigator.onLine,
  });

  const filteredData = useMemo(() => {
    if (!data) return []; // Handle null or undefined `data`

    const normalizedSearchTerm =
      typeof searchTerm === 'string' ? searchTerm.toLowerCase() : '';

    return data.filter((item: VideoDataModel) => {
      const matchesCategory =
        !selectedCategory || item['ໝວດທັມ'] === selectedCategory; // Filter based on category
      const matchesSearch =
        !normalizedSearchTerm || // If no search term, all items match
        [item['ຊື່ພຣະສູດ'], item['ພຣະສູດ'], item['ໝວດທັມ']]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearchTerm);
      return matchesCategory && matchesSearch;
    });
  }, [data, searchTerm, selectedCategory]); // Dependencies are data, searchTerm, and selectedCategory

  // Derive unique categories for the dropdown from `data`
  const uniqueCategories = Array.from(
    new Set(data?.map((item: VideoDataModel) => item['ໝວດທັມ']).filter(Boolean))
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
    uniqueCategories,
  };
};

export default useVideo;
