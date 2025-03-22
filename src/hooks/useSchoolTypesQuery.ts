
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export interface SchoolType {
  id: string;
  name: string;
}

export const useSchoolTypesQuery = () => {
  const [schoolTypes, setSchoolTypes] = useState<SchoolType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSchoolTypes = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // RPC funksiyasını istifadə edərək məktəb növlərini əldə edirik
        const { data, error } = await supabase.rpc('get_school_types');
        
        if (error) throw error;
        
        if (data && Array.isArray(data)) {
          setSchoolTypes(data);
        } else {
          setSchoolTypes([]);
        }
      } catch (err) {
        console.error('Error fetching school types:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchoolTypes();
  }, []);

  return { schoolTypes, isLoading, error };
};
