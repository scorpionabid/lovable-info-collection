
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { SchoolType } from '@/lib/supabase/types';

export const useSchoolTypes = () => {
  const [schoolTypes, setSchoolTypes] = useState<SchoolType[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['schoolTypes'],
    queryFn: async () => {
      // Use RPC function to get school types instead of a direct table query
      const { data, error } = await supabase.rpc('get_school_types');
      
      if (error) {
        console.error('Error fetching school types:', error);
        throw error;
      }
      
      return data as SchoolType[];
    }
  });

  useEffect(() => {
    if (data) {
      setSchoolTypes(data);
    }
  }, [data]);

  return { 
    schoolTypes, 
    isLoading, 
    error 
  };
};

export default useSchoolTypes;
