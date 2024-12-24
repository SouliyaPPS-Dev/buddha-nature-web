import { useSearchContext } from '@/components/search/SearchContext';
import { SutraDataModel } from '@/model/sutra';
import { useSutra } from './useSutra';
import { Route } from '@/routes/sutra/$category.lazy';

export const useCategory = () => {
     const { searchTerm, setSearchTerm } = useSearchContext();

     const params = Route.useParams();
     const { category } = params;

     // Fetch Sutra Data
     const { data, currentlyPlayingId, handlePlayAudio } = useSutra();

     // Filter items based on category and search term
     const filteredItemsCategory = data?.filter((item: SutraDataModel) => {
          // Match category
          const matchesCategory = category ? item['ໝວດທັມ'] === category : true;

          // Match search term in any field (case-insensitive)
          const matchesSearchTerm = searchTerm
               ? [item['ຊື່ພຣະສູດ'], item['ພຣະສູດ'], item['ໝວດທັມ']]
                    .some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()))
               : true;

          return matchesCategory && matchesSearchTerm;
     });

     return {
          data: filteredItemsCategory,
          category,

          // Search
          searchTerm,
          setSearchTerm,

          // Audio
          currentlyPlayingId,
          handlePlayAudio
     };
};