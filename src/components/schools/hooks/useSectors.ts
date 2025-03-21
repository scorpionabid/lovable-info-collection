
// İstifadəçilərin köhnə code-dan istifadəsini dəstəkləmək üçün
// Əvvəlki strukturdan yeni strukturdakı funksiyaları export edirik
import { useSectorsByRegion } from '@/supabase/hooks/useSectors';

// Default export sektorları region id ilə almaq üçün hook
export default function useSectors(regionId: string) {
  const { sectors, isLoading, error } = useSectorsByRegion(regionId);
  
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

export const useSectors = useSectorsByRegion;
