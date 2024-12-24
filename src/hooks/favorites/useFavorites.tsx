import { useSearchContext } from '@/components/search/SearchContext';
import { localStorageData } from '@/services/cache';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState, useEffect, useRef } from 'react';

export const useFavorites = () => {
  const { searchTerm, setSearchTerm } = useSearchContext();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // State for filtering by category
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(
    null
  );

  const audioRef = useRef<HTMLAudioElement | null>(null); // Ref for audio element

  const favoritesData = async () => {
    const data = localStorageData.getFavorite();
    return data ? JSON.parse(data) : [];
  };

  const { data, refetch } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => favoritesData(),
    staleTime: 1,
  });

  const filteredData = useMemo(() => {
    if (!data) return []; // Handle null or undefined `data`

    const normalizedSearchTerm =
      typeof searchTerm === 'string' ? searchTerm.toLowerCase() : '';

    return data.filter((item: any) => {
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
    new Set(data?.map((item: any) => item['ໝວດທັມ']).filter(Boolean))
  ) as any;

  // Play selected audio
  const handlePlayAudio = (id: string) => {
    setCurrentlyPlayingId(id);

    if (audioRef.current) {
      audioRef.current.src =
        data?.find((item: any) => item.ID === id)?.audioUrl || '';
      audioRef.current.play();
    }
  };

  // Find and play the next audio
  const handleNextAudio = () => {
    if (!data) return;

    let currentIndex = data.findIndex(
      (item: any) => item.ID === currentlyPlayingId
    );

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
    data: filteredData,
    refetch,

    // Category
    selectedCategory,
    uniqueCategories,
    setSelectedCategory,

    // Search
    searchTerm,
    setSearchTerm,

    // Audio
    currentlyPlayingId,
    handlePlayAudio,
    handleNextAudio,
    audioRef,
  };
};
