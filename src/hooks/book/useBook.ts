import { useSearchContext } from '@/components/search/SearchContext';
import { BookDataModel } from '@/model/book';
import { localStorageData } from '@/services/cache';
import { bookApi } from '@/services/https/book';
import { queryClient } from '@/services/react-query/client';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

export const useBook = (id?: string) => {
  const { searchTerm, setSearchTerm } = useSearchContext();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredItems, setFilteredItems] = useState<BookDataModel[]>([]); // State for filtered items

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['book', searchTerm, selectedCategory],
    queryFn: async () => bookApi(),
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: navigator.onLine,
  });

  // Filter data if available
  const filteredData = useMemo(() => {
    if (!data) return [];

    const normalizedSearchTerm = searchTerm?.toLowerCase() || '';

    return data.filter((item: BookDataModel) => {
      const matchesCategory =
        !selectedCategory || item['ໝວດຟາຍ'] === selectedCategory;
      const matchesSearch =
        !normalizedSearchTerm ||
        [item['ຊື່'], item['ໝວດຟາຍ'], item['ໝວດທັມ']]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearchTerm);

      return matchesCategory && matchesSearch;
    });
  }, [data, searchTerm, selectedCategory]);

  // Derive unique categories for the dropdown from `data`
  const uniqueCategories = Array.from(
    new Set(data?.map((item: BookDataModel) => item['ໝວດຟາຍ']).filter(Boolean))
  ) as any;

  // Timeout for filtering by ID
  useEffect(() => {
    if (!filteredData) return;

    const timeout = setTimeout(() => {
      const result = filteredData.filter((item: BookDataModel) =>
        id ? item['ID'] === id : true
      );

      setFilteredItems(result.length > 1 ? [] : result); // Empty if more than one result
    }, 500); // 500ms delay

    return () => clearTimeout(timeout); // Cleanup timeout
  }, [filteredData, id]);

  const lastItem = filteredItems?.[0] || null;

  const linkBook = lastItem?.['link'] || '';
  const titleBook = lastItem?.['ຊື່'] || '';

  useEffect(() => {
    localStorageData.setTitle(titleBook);
  }, [titleBook]);

  // PDF preview link
  const pdfEmbedLink = linkBook
    ? linkBook.replace(
        /https:\/\/drive\.google\.com\/file\/d\/(.*?)\/view\?usp=sharing/,
        'https://drive.google.com/file/d/$1/preview'
      )
    : '';

  const downloadLink = linkBook.replace(
    /https:\/\/drive\.google\.com\/file\/d\/(.*?)\/view\?usp=sharing/,
    'https://drive.google.com/uc?export=download&id=$1'
  );

  useEffect(() => {
    if (downloadLink) {
      queryClient.setQueryData(['downloadBookLink'], downloadLink);
    }
  }, [downloadLink]);

  return {
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

    // PDF Link
    pdfEmbedLink,
    titleBook,
    linkBook,
  };
};
