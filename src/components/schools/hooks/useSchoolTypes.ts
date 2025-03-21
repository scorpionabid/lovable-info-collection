
// İstifadəçilərin köhnə code-dan istifadəsini dəstəkləmək üçün
// Əvvəlki strukturdan yeni strukturdakı funksiyaları export edirik
import { useSchoolTypes as useSchoolTypesNew } from '@/supabase/hooks/useSchools';
import { SchoolType } from '@/supabase/types';

// Tip definisiyası
export type { SchoolType };

// Public API
export const useSchoolTypes = useSchoolTypesNew;

// Default export məktəb tiplərini almaq üçün hook (geriyə uyğunluq üçün)
export default function useSchoolTypesDefault() {
  const { schoolTypes, isLoading, error } = useSchoolTypesNew();
  
  return {
    schoolTypes,
    isLoading,
    error
  };
}
