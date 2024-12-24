import { useSearchContext } from '@/components/search/SearchContext';
import { sutraApi } from '@/services/https/sutra';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

export const useSutra = () => {
     const { searchTerm, setSearchTerm } = useSearchContext();
     const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(
          null
     );

     // Pause other audios when a new one is played
     const handlePlayAudio = (id: string) => {
          setCurrentlyPlayingId(id);
     };

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


     return {
          // Data
          data: filteredData, getGroupedData,
          // Search
          isLoading, searchTerm, setSearchTerm, refetch,
          // Audio
          currentlyPlayingId, handlePlayAudio
     };
};