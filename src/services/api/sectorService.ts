import api from './index';
import { getSectors as getSupabaseSectors, getSectorById, getSectorSchools } from '@/services/supabase/sector/querySectors';
import { createSector as createSupabaseSector, updateSector as updateSupabaseSector, deleteSector as deleteSupabaseSector } from '@/services/supabase/sector/crudOperations';
import { logger } from '@/utils/logger';
import { measurePerformance } from '@/utils/performanceMonitor';

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
 * Sektor servisi - həm RESTful API, həm də birbaşa Supabase sorğularını dəstəkləyir
 * 
 * Əsas istifadə: sektorlar üçün CRUD əməliyyatları
 */
const sectorService = {
  /**
   * Sektorları əldə etmək
   * @param filters Filtr parametrləri
   * @returns Sektorlar siyahısı və ümumi say
   */
  getSectors: async (filters: SectorFilter = {}) => {
    // Performans monitorinqi ilə əhatə edirik
    return measurePerformance('sectorService.getSectors', async () => {
      try {
        // Birbaşa Supabase sorğusu istifadə et - getSectors artıq özü performans monitorinqi ilə əhatə olunub
        const result = await getSupabaseSectors(
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
        
        logger.info('sectorService.getSectors succeeded', { count: result.count });
        return result;
      } catch (error) {
        logger.error('sectorService.getSectors failed', error);
        
        // Fallback olaraq RESTful API istifadə et
        logger.info('Falling back to RESTful API call');
        const response = await api.get('/sectors', { params: filters });
        return response.data;
      }
    }, { filters });
  },
  
  /**
   * Yeni sektor yaratmaq
   * @param sectorData Sektor məlumatları
   * @returns Yaradılmış sektor
   */
  createSector: async (sectorData: SectorData) => {
    // Performans monitorinqi ilə əhatə edirik
    return measurePerformance('sectorService.createSector', async () => {
      try {
        // Birbaşa Supabase sorğusu istifadə et
        const result = await createSupabaseSector({
          name: sectorData.name,
          description: sectorData.description || '',
          region_id: sectorData.regionId  // Convert regionId to region_id for Supabase
        });
        
        logger.info('sectorService.createSector succeeded', { sectorId: result.id });
        return result;
      } catch (error) {
        logger.error('sectorService.createSector failed', error);
        
        // Fallback olaraq RESTful API istifadə et
        const response = await api.post('/sectors', sectorData);
        return response.data;
      }
    }, { sectorData: { name: sectorData.name, regionId: sectorData.regionId } });
  },
  
  /**
   * Sektor məlumatlarını əldə etmək
   * @param id Sektor ID
   * @returns Sektor məlumatları
   */
  getSector: async (id: string) => {
    // Performans monitorinqi ilə əhatə edirik
    return measurePerformance('sectorService.getSector', async () => {
      try {
        // Birbaşa Supabase sorğusu istifadə et - getSectorById artıq özü performans monitorinqi ilə əhatə olunub
        const result = await getSectorById(id);
        return result;
      } catch (error) {
        logger.error('sectorService.getSector failed', error);
        
        // Fallback olaraq RESTful API istifadə et
        const response = await api.get(`/sectors/${id}`);
        return response.data;
      }
    }, { sectorId: id });
  },
  
  /**
   * Sektor məlumatlarını yeniləmək
   * @param id Sektor ID
   * @param sectorData Yenilənəcək məlumatlar
   * @returns Yenilənmiş sektor
   */
  updateSector: async (id: string, sectorData: Partial<SectorData>) => {
    // Performans monitorinqi ilə əhatə edirik
    return measurePerformance('sectorService.updateSector', async () => {
      try {
        // Birbaşa Supabase sorğusu istifadə et
        const result = await updateSupabaseSector(id, {
          name: sectorData.name,
          description: sectorData.description,
          region_id: sectorData.regionId  // Convert regionId to region_id for Supabase
        });
        
        logger.info('sectorService.updateSector succeeded', { sectorId: id });
        return result;
      } catch (error) {
        logger.error('sectorService.updateSector failed', error);
        
        // Fallback olaraq RESTful API istifadə et
        const response = await api.put(`/sectors/${id}`, sectorData);
        return response.data;
      }
    }, { sectorId: id, sectorData: { name: sectorData.name, regionId: sectorData.regionId } });
  },
  
  /**
   * Sektoru silmək
   * @param id Sektor ID
   * @returns Silmə əməliyyatının nəticəsi
   */
  deleteSector: async (id: string) => {
    // Performans monitorinqi ilə əhatə edirik
    return measurePerformance('sectorService.deleteSector', async () => {
      try {
        // Birbaşa Supabase sorğusu istifadə et
        const result = await deleteSupabaseSector(id);
        
        logger.info('sectorService.deleteSector succeeded', { sectorId: id });
        return result;
      } catch (error) {
        logger.error('sectorService.deleteSector failed', error);
        
        // Fallback olaraq RESTful API istifadə et
        const response = await api.delete(`/sectors/${id}`);
        return response.data;
      }
    }, { sectorId: id });
  },
  
  /**
   * Sektor məktəblərini əldə etmək
   * @param id Sektor ID
   * @returns Sektor məktəbləri
   */
  getSectorSchools: async (id: string) => {
    // Performans monitorinqi ilə əhatə edirik
    return measurePerformance('sectorService.getSectorSchools', async () => {
      try {
        // Birbaşa Supabase sorğusu istifadə et - getSectorSchools artıq özü performans monitorinqi ilə əhatə olunub
        const result = await getSectorSchools(id);
        return result;
      } catch (error) {
        logger.error('sectorService.getSectorSchools failed', error);
        
        // Fallback olaraq RESTful API istifadə et
        const response = await api.get(`/sectors/${id}/schools`);
        return response.data;
      }
    }, { sectorId: id });
  }
};

export default sectorService;
