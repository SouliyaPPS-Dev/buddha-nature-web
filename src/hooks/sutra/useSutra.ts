import { useSearchContext } from '@/components/search/SearchContext';
import { sutraApi } from '@/services/https/sutra';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState, useRef } from 'react';

export const useSutra = () => {
     const { searchTerm, setSearchTerm } = useSearchContext();
     const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(
          null
     );
     const audioRef = useRef<HTMLAudioElement | null>(null); // Ref for audio element

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


     // Play selected audio
     const handlePlayAudio = (id: string) => {
          setCurrentlyPlayingId(id);

          if (audioRef.current) {
               audioRef.current.src =
                    data?.find((item: any) => item.ID === id)?.ສຽງ || '';
               audioRef.current.play();
          }
     };

     // Find and play the next audio
     const handleNextAudio = () => {
          if (!data) return;

          let currentIndex = data.findIndex((item: any) => item.ID === currentlyPlayingId);

          // Loop to find the next valid audio (skip if data is '/')
          while (currentIndex + 1 < data.length) {
               currentIndex += 1;
               if (data[currentIndex]?.ສຽງ && data[currentIndex]?.ສຽງ !== '/') {
                    handlePlayAudio(data[currentIndex].ID);
                    break;
               }
          }
     };
     
     // Listen for audio end event
     useEffect(() => {
          const audio = audioRef.current;

          if (audio) {
               audio.addEventListener('ended', handleNextAudio);
          }

          return () => {
               if (audio) {
                    audio.removeEventListener('ended', handleNextAudio);
               }
          };
     }, [currentlyPlayingId, data]);

     return {
          // Data
          data: filteredData, getGroupedData,
          // Search
          isLoading, searchTerm, setSearchTerm, refetch,
          // Audio
          currentlyPlayingId, handlePlayAudio, handleNextAudio
     };
};