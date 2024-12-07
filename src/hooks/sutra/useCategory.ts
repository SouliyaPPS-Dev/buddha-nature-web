import { SutraDataModel } from '@/model/sutra';
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
     const filteredItemsCategory = data?.filter((item: SutraDataModel) => {
          // Match category
          const matchesCategory = category === '' || item['ໝວດທັມ'] === category;

          // Match search term in any field
          const matchesSearchTerm =
               item['ຊື່ພຣະສູດ']?.includes(searchTerm.toLowerCase()) ||
               item['ພຣະສູດ']?.includes(searchTerm.toLowerCase()) ||
               item['ໝວດທັມ']?.includes(searchTerm.toLowerCase());

          return matchesCategory && matchesSearchTerm;
     });

     return {
          data: filteredItemsCategory,
          searchTerm,
          setSearchTerm,
     };
};