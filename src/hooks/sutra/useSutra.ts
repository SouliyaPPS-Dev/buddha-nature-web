import { useSearchContext } from '@/components/search/SearchContext';
import { sutraApi } from '@/services/https/sutra';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useDebounce } from 'use-debounce';

export const useSutra = () => {
     const { searchTerm, setSearchTerm } = useSearchContext();

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

     /* Helper Function: Group data by category */
     const getGroupedData = useMemo(() => {
          if (!data) return [];

          // Group data by category ('ໝວດທັມ')
          const groupedData = data.reduce<Record<string, typeof data[number][]>>(
               (acc, item) => {
                    if (!acc[item['ໝວດທັມ']]) {
                         acc[item['ໝວດທັມ']] = [];
                    }
                    acc[item['ໝວດທັມ']].push(item); // Group items under the same category
                    return acc;
               },
               {}
          );

          // Convert the grouped object into an array of key-value pairs
          return Object.entries(groupedData);
     }, [data]); // Only recompute when `data` changes

     return { data: filteredData, getGroupedData, isLoading, searchTerm, setSearchTerm };
};