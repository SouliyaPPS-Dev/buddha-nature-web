import { useSearchContext } from '@/components/search/SearchContext';
import { sutraApi } from '@/services/https/sutra';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';


export const useSutra = () => {
     const { searchTerm, setSearchTerm } = useSearchContext();

     // State
     const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
     const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);

     // Audio Ref
     const audioRef = useRef<HTMLAudioElement | null>(null);

     // Fetch Data
     const { data, isLoading, refetch } = useQuery({
          queryKey: ['sutra'],
          queryFn: async () => sutraApi(),
     });

     /**
      * 📝 Filtered Data
      * - Filters data based on `searchTerm` and `selectedCategory`.
      */
     const filteredData = useMemo(() => {
          if (!data) return [];

          const normalizedSearchTerm = searchTerm?.toLowerCase() || '';

          return data.filter((item: any) => {
               const matchesCategory = !selectedCategory || item['ໝວດທັມ'] === selectedCategory;
               const matchesSearch = !normalizedSearchTerm ||
                    [item['ຊື່ພຣະສູດ'], item['ພຣະສູດ'], item['ໝວດທັມ']]
                         .join(' ')
                         .toLowerCase()
                         .includes(normalizedSearchTerm);

               return matchesCategory && matchesSearch;
          });
     }, [data, searchTerm, selectedCategory]);

     /**
      * 🗂️ Grouped Data
      * - Groups data by category.
      */
     const groupedData = useMemo(() => {
          if (!data) return [];

          return Object.entries(
               data.reduce<Record<string, typeof data[number][]>>((acc, item) => {
                    acc[item['ໝວດທັມ']] = acc[item['ໝວດທັມ']] || [];
                    acc[item['ໝວດທັມ']].push(item);
                    return acc;
               }, {})
          );
     }, [data]);

     // Ensure categories are typed correctly
     const uniqueCategories = Array.from(
          new Set(data?.map((item: any) => item['ໝວດທັມ']).filter(Boolean))
     ) as any;

     /**
      * 🎵 Play Audio
      * - Handles playing selected audio.
      */
     const handlePlayAudio = (id: string) => {
          setCurrentlyPlayingId(id);
          const audioSrc = data?.find((item: any) => item.ID === id)?.ສຽງ || '';

          if (audioRef.current && audioSrc) {
               audioRef.current.src = audioSrc;
               audioRef.current.play();
          }
     };

     /**
      * ⏭️ Play Next Audio
      * - Plays the next valid audio track.
      */
     const handleNextAudio = () => {
          if (!data) return;

          const currentIndex = data.findIndex((item: any) => item.ID === currentlyPlayingId);

          for (let i = currentIndex + 1; i < data.length; i++) {
               if (data[i]?.ສຽງ && data[i]?.ສຽງ !== '/') {
                    handlePlayAudio(data[i].ID);
                    break;
               }
          }
     };

     /**
      * 🎧 Audio Event Listener
      * - Adds event listener for audio `ended` event.
      */
     useEffect(() => {
          const audio = audioRef.current;
          audio?.addEventListener('ended', handleNextAudio);

          return () => {
               audio?.removeEventListener('ended', handleNextAudio);
          };
     }, [currentlyPlayingId, data]);

     return {
          // Data
          data: filteredData,
          groupedData,
          uniqueCategories,

          // Search
          isLoading,
          searchTerm,
          setSearchTerm,
          refetch,

          // Audio
          currentlyPlayingId,
          handlePlayAudio,
          handleNextAudio,

          // Category
          selectedCategory,
          setSelectedCategory,
     };
};