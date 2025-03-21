
import { useQuery } from '@tanstack/react-query';
import { getSchoolTypeById } from '@/supabase/services/schools';
import { SchoolType } from '@/supabase/types';

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
