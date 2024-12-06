import { Route } from '@/routes/sutra/$category';
import { useState } from 'react';
import { useSutra } from './useSutra';

export const useCategory = () => {
     const [searchTerm, setSearchTerm] = useState('');
     const params = Route.useParams();
     const { category } = params;

     // Fetch Sutra Data
     const { data } = useSutra();

     // Filter items based on category and search term
     const filteredItemsCategory = data?.filter(
          (item) =>
               (item['ໝວດທັມ'] === category || category === '') && // Match category
               item['ຊື່ພຣະສູດ']?.includes(searchTerm) // Match search term
     );

     return {
          data: filteredItemsCategory,
          searchTerm,
          setSearchTerm,
     };
};