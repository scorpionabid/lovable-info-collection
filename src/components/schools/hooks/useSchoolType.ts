
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { SchoolType } from '@/lib/supabase/types';

export const useSchoolType = (typeId: string | undefined) => {
  const [schoolType, setSchoolType] = useState<SchoolType | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['schoolType', typeId],
    queryFn: async () => {
      if (!typeId) return null;

      // Use RPC function to get school types instead of a direct table query
      const { data, error } = await supabase.rpc('get_school_types');
      
      if (error) {
        console.error('Error fetching school types:', error);
        throw error;
      }
      
      return data as SchoolType[];
    },
    enabled: !!typeId,
  });

  useEffect(() => {
    if (data && typeId) {
      const found = data.find(type => type.id === typeId);
      setSchoolType(found || null);
    }
  }, [data, typeId]);

  return { 
    schoolType: schoolType || { id: '', name: '' },
    isLoading, 
    error 
  };
};

export default useSchoolType;
