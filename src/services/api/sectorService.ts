
import { getSectors, getSectorById, getSectorSchools, createSector, updateSector, deleteSector } from '@/services/supabase/sector';
import { SectorWithStats } from '@/services/supabase/sector/types';
import { logger } from '@/utils/logger';

export interface SectorData {
  id?: string;
  name: string;
  description?: string;
  regionId: string;  // Note: We keep this as regionId here for API compatibility
}

export interface SectorFilter {
  regionId?: string;
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
}

/**
 * Sektor servisi - artıq birbaşa Supabase funksiyalarına müraciət edir
 * Bu fayl köhnə kodun işləməsi üçün saxlanılır, amma birbaşa olaraq 
 * "@/services/supabase/sector" istifadə etmək tövsiyə olunur
 */
const sectorService = {
  /**
   * Sektorları əldə etmək
   * @param filters Filtr parametrləri
   * @returns Sektorlar siyahısı və ümumi say
   */
  getSectors: async (filters: SectorFilter = {}) => {
    try {
      // Birbaşa Supabase sorğusu istifadə et
      return await getSectors(
        { 
          page: filters.page || 1, 
          pageSize: filters.limit || 10 
        },
        { 
          column: filters.sortColumn || 'name', 
          direction: filters.sortDirection || 'asc' 
        },
        { 
          searchQuery: filters.search || '',
          regionId: filters.regionId || '',
          dateFrom: '',
          dateTo: '',
          completionRate: 'all'
        }
      );
    } catch (error) {
      logger.error('sectorService.getSectors failed', error);
      throw error;
    }
  },
  
  /**
   * Yeni sektor yaratmaq
   * @param sectorData Sektor məlumatları
   * @returns Yaradılmış sektor
   */
  createSector: async (sectorData: SectorData) => {
    try {
      // regionId -> region_id çevrilib Supabase sorğusu istifadə et
      return await createSector({
        name: sectorData.name,
        description: sectorData.description || '',
        region_id: sectorData.regionId  // Convert regionId to region_id for Supabase
      });
    } catch (error) {
      logger.error('sectorService.createSector failed', error);
      throw error;
    }
  },
  
  /**
   * Sektor məlumatlarını əldə etmək
   * @param id Sektor ID
   * @returns Sektor məlumatları
   */
  getSector: async (id: string): Promise<SectorWithStats> => {
    try {
      return await getSectorById(id);
    } catch (error) {
      logger.error('sectorService.getSector failed', error);
      throw error;
    }
  },
  
  /**
   * Sektor məlumatlarını yeniləmək
   * @param id Sektor ID
   * @param sectorData Yenilənəcək məlumatlar
   * @returns Yenilənmiş sektor
   */
  updateSector: async (id: string, sectorData: Partial<SectorData>) => {
    try {
      // regionId -> region_id çevrilib Supabase sorğusu istifadə et
      return await updateSector(id, {
        name: sectorData.name,
        description: sectorData.description,
        region_id: sectorData.regionId  // Convert regionId to region_id for Supabase
      });
    } catch (error) {
      logger.error('sectorService.updateSector failed', error);
      throw error;
    }
  },
  
  /**
   * Sektoru silmək
   * @param id Sektor ID
   * @returns Silmə əməliyyatının nəticəsi
   */
  deleteSector: async (id: string) => {
    try {
      await deleteSector(id);
      return { success: true };
    } catch (error) {
      logger.error('sectorService.deleteSector failed', error);
      throw error;
    }
  },
  
  /**
   * Sektor məktəblərini əldə etmək
   * @param id Sektor ID
   * @returns Sektor məktəbləri
   */
  getSectorSchools: async (id: string) => {
    try {
      return await getSectorSchools(id);
    } catch (error) {
      logger.error('sectorService.getSectorSchools failed', error);
      throw error;
    }
  }
};

export default sectorService;
