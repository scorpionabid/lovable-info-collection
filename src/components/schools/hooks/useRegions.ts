
// İstifadəçilərin köhnə code-dan istifadəsini dəstəkləmək üçün
// Əvvəlki strukturdan yeni strukturdakı funksiyaları export edirik
import { useRegionsDropdown } from '@/supabase/hooks/useRegions';

// Default export regionları almaq üçün hook
export default function useRegions() {
  const { regions, isLoading, error } = useRegionsDropdown();
  
  // Köhnə struktura uyğun data qaytarırıq
  const formattedRegions = regions.map(region => ({
    ...region,
    description: '' // Əskik sahələri əlavə edirik
  }));
  
  return {
    regions: formattedRegions,
    isLoading,
    error
  };
}

export const useRegions = useRegionsDropdown;
