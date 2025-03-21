
// İstifadəçilərin köhnə code-dan istifadəsini dəstəkləmək üçün
// Əvvəlki strukturdan yeni strukturdakı funksiyaları export edirik
import { useSectorsDropdown } from '@/supabase/hooks/useSectors';
import { Sector } from '@/supabase/types';

// Tip definisiyası
export type { Sector };

// Public API
export const useSectors = useSectorsDropdown;

// Default export sektorları almaq üçün hook (geriyə uyğunluq üçün)
export default function useSectorsDefault() {
  const { sectors, isLoading, error } = useSectorsDropdown();
  
  // Köhnə struktura uyğun data qaytarırıq
  const formattedSectors = sectors.map(sector => ({
    ...sector,
    description: sector.description || '' // Əskik sahələri əlavə edirik
  }));
  
  return {
    sectors: formattedSectors,
    isLoading,
    error
  };
}
