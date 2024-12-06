/* eslint-disable @typescript-eslint/no-explicit-any */
import { sutraApi } from "@/services/https/sutra";
import { useQuery } from "@tanstack/react-query";

export const useSutra = () => {
     const { data, isLoading, error } = useQuery({
          queryKey: ['sutra'],
          queryFn: sutraApi,
     });

     const info = data?.map((item) => item);

     // Safely ensure data isn't null or undefined
     const categoryData = data || [];

     // Collect unique categories from the data
     const categories = Array.from(
          new Set(categoryData.map((item: any) => item['ໝວດທັມ']) || [])
     );


     return {
          // Data
          data: info,
          categories,

          // Additional properties
          isLoading,
          error
     }

}