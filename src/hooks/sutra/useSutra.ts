import { useSearchContext } from '@/components/search/SearchContext';
import { sutraApi } from '@/services/https/sutra';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const useSutra = () => {
     const { searchTerm, setSearchTerm } = useSearchContext();

     const { data, isLoading, refetch } = useQuery({
          queryKey: ['sutra'],
          queryFn: async () => sutraApi(),
     });

     const filteredData = useMemo(() => {
          if (!data) return [];

          const normalizedSearchTerm = typeof searchTerm === 'string' ? searchTerm.toLowerCase() : '';

          if (normalizedSearchTerm !== '') {
               return data.filter((item) =>
                    [item['ຊື່ພຣະສູດ'], item['ພຣະສູດ'], item['ໝວດທັມ']]
                         .join(' ')
                         .toLowerCase()
                         .includes(normalizedSearchTerm)
               );
          } else {
               return data;
          }
     }, [data, searchTerm]);

     /* Helper Function: Group data by category */
     const getGroupedData = useMemo(() => {
          if (!data) return [];

          const groupedData = data.reduce<Record<string, typeof data[number][]>>(
               (acc, item) => {
                    if (!acc[item['ໝວດທັມ']]) {
                         acc[item['ໝວດທັມ']] = [];
                    }
                    acc[item['ໝວດທັມ']].push(item);
                    return acc;
               },
               {}
          );

          return Object.entries(groupedData);
     }, [data]);


     return { data: filteredData, getGroupedData, isLoading, searchTerm, setSearchTerm, refetch };
};