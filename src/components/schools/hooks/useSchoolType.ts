
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export interface SchoolType {
  id: string;
  name: string;
}

export const useSchoolType = (typeId?: string) => {
  const [schoolType, setSchoolType] = useState<SchoolType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!typeId) return;

    const fetchSchoolType = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Stored procedure çağırışı ilə məktəb tiplərini əldə edirik
        const { data, error } = await supabase.rpc('get_school_types');
        
        if (error) throw error;
        
        if (data && Array.isArray(data)) {
          // Məktəb tipini ID-yə görə tapırıq
          const foundType = data.find(type => type.id === typeId);
          setSchoolType(foundType || null);
        } else {
          setSchoolType(null);
        }
      } catch (err) {
        console.error('Error fetching school type:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchoolType();
  }, [typeId]);

  return { schoolType, isLoading, error };
};
