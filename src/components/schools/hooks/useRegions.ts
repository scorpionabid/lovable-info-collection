
// İstifadəçilərin köhnə code-dan istifadəsini dəstəkləmək üçün
// Əvvəlki strukturdan yeni strukturdakı funksiyaları export edirik
import { useRegionsDropdown } from '@/supabase/hooks/useRegions';
import { Region } from '@/supabase/types';

// Tip definisiyası
export type { Region };

// Public API
export const useRegions = useRegionsDropdown;

// Default export regionları almaq üçün hook (geriyə uyğunluq üçün)
export default function useRegionsDefault() {
  const { regions, isLoading, error } = useRegionsDropdown();
  
  // Köhnə struktura uyğun data qaytarırıq
  const formattedRegions = regions.map(region => ({
    ...region,
    // Make sure we don't access a property that doesn't exist
    description: region.description || '' // Əskik sahələri əlavə edirik
  }));
  
  return {
    regions: formattedRegions,
    isLoading,
    error
  };
}
