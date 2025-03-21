
import { useQuery } from '@tanstack/react-query';
import { getSchoolById } from '@/supabase/services/schools';
import { SchoolType } from '@/supabase/types';

// Fixed function to get school type by id
const getSchoolTypeById = async (typeId: string): Promise<SchoolType | null> => {
  try {
    const response = await fetch(`/api/school-types/${typeId}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching school type:', error);
    return null;
  }
};

export const useSchoolType = (typeId?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['school-type', typeId],
    queryFn: () => getSchoolTypeById(typeId || ''),
    enabled: !!typeId,
  });

  return {
    schoolType: data as SchoolType | undefined,
    isLoading,
    error
  };
};
