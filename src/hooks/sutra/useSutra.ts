import { useSearch } from '@/components/SearchContext';
import { sutraApi } from '@/services/https/sutra';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useDebounce } from 'use-debounce';

export const useSutra = () => {
     const { searchTerm, setSearchTerm } = useSearch();

     const [debouncedSearchTerm] = useDebounce(searchTerm, 300); // Delay filtering

     const { data, isLoading } = useQuery({
          queryKey: ['sutra'],
          queryFn: async () => sutraApi(),
     });

     const filteredData = useMemo(() => {
          if (!data) return [];
          return data.filter((item) =>
               [item['ຊື່ພຣະສູດ'], item['ພຣະສູດ'], item['ໝວດທັມ']]
                    .join(' ')
                    .toLowerCase()
                    .includes(debouncedSearchTerm.toLowerCase())
          );
     }, [debouncedSearchTerm, data]);

     return { data: filteredData, isLoading, searchTerm, setSearchTerm };
};