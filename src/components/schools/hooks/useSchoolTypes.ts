
// İstifadəçilərin köhnə code-dan istifadəsini dəstəkləmək üçün
// Əvvəlki strukturdan yeni strukturdakı funksiyaları export edirik
import { useSchoolTypes as useSchoolTypesNew } from '@/supabase/hooks/useSchools';
import { SchoolType } from '@/supabase/types';

// Default export məktəb tiplərini almaq üçün hook
export default function useSchoolTypes() {
  const { schoolTypes, isLoading, error } = useSchoolTypesNew();
  
  return {
    schoolTypes,
    isLoading,
    error
  };
}

// Tip definisiyası
export type { SchoolType };
export const useSchoolTypes = useSchoolTypesNew;
