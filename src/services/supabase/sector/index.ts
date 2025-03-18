
import { SectorWithStats, SortParams, FilterParams, PaginationParams, SectorData } from './types';
import { supabase, withRetry } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { measurePerformance } from '@/utils/performanceMonitor';

// Sektorlar üçün loqger yaradaq
const sectorLogger = logger.createLogger('sectorService');

/**
 * Bütün sektorları əldə etmək
 * @param pagination Səhifələmə parametrləri
 * @param sort Sıralama parametrləri
 * @param filters Filtr parametrləri
 * @returns Sektorlar və ümumi say
 */
export const getSectors = async (
  pagination: PaginationParams,
  sort: SortParams,
  filters: FilterParams
): Promise<{ data: SectorWithStats[], count: number }> => {
  return measurePerformance('sectorService.getSectors', async () => {
    try {
      const { page, pageSize } = pagination;
      const { column, direction } = sort;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      sectorLogger.info('Fetching sectors with params', { pagination, sort, filters });
      
      // Baza sorğusu
      let query = supabase
        .from('sectors')
        .select(`
          *,
          regions!left (
            id,
            name
          )
        `, { count: 'exact' });
      
      // Axtarış filtri
      if (filters.searchQuery) {
        query = query.ilike('name', `%${filters.searchQuery}%`);
      }
      
      // Region filtri
      if (filters.regionId) {
        query = query.eq('region_id', filters.regionId);
      }
      
      // Tarix filtri
      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }
      
      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }
      
      // Arxivlənmiş elementlər filtri
      if (filters.archived) {
        query = query.eq('archived', filters.archived === 'true');
      } else {
        // Default olaraq arxivlənməmiş elementləri göstəririk
        query = query.eq('archived', false);
      }
      
      // Sıralama
      query = query.order(column, { ascending: direction === 'asc' });
      
      // Səhifələmə
      query = query.range(from, to);

      // Sorğunu icra et (timeout ilə)
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Query timeout (10s)')), 10000);
      });

      const result = await Promise.race([query, timeoutPromise]);

      // Nəticəni müvafiq tipə çeviririk
      const { data, count, error } = result as any;

      if (error) {
        throw error;
      }

      // Nəticəni işləyirik
      const processedData: SectorWithStats[] = data?.map((sector: any) => {
        // Region adını birləşdirilmiş məlumatlardan çıxarırıq
        const regionName = sector.regions?.name || 'N/A';
        
        // Düzgün strukturlaşdırılmış sektor obyekti yaradırıq
        return {
          id: sector.id,
          name: sector.name || 'N/A',
          description: sector.description || '',
          region_id: sector.region_id,
          regionName: regionName,
          created_at: sector.created_at,
          // İlkin sorğuda bu məlumatları əldə etmədiyimizə görə placeholder məlumatlar
          schoolCount: 0,
          completionRate: 0,
          archived: sector.archived || false
        };
      }) || [];

      sectorLogger.info(`Successfully fetched ${processedData.length} sectors out of ${count} total`);
      
      return {
        data: processedData,
        count: count || 0
      };
    } catch (error) {
      const errorInfo: any = {
        message: error instanceof Error ? error.message : 'Unknown error'
      };
      
      // PostgrestError üçün əlavə məlumatlar
      if (error instanceof Object && 'details' in error) {
        errorInfo.details = (error as PostgrestError).details;
      }
      
      sectorLogger.error('Error fetching sectors', { error: errorInfo });
      throw error;
    }
  });
};

/**
 * ID ilə bir sektor əldə etmək
 * @param id Sektor ID
 * @returns Sektor məlumatları
 */
export const getSectorById = async (id: string): Promise<SectorWithStats> => {
  return measurePerformance('sectorService.getSectorById', async () => {
    try {
      sectorLogger.info('Fetching sector by ID', { id });
      
      const query = supabase
        .from('sectors')
        .select(`
          *,
          regions!left (
            id,
            name
          )
        `)
        .eq('id', id)
        .single();
      
      // Sorğunu timeout ilə icra et
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Query timeout (10s)')), 10000);
      });

      const result = await Promise.race([query, timeoutPromise]);
      
      // Nəticəni işləyirik
      const { data, error } = result as any;
      
      if (error) {
        sectorLogger.error('Error fetching sector by ID', { id, error });
        throw error;
      }
      
      if (!data) {
        const notFoundError = new Error(`Sector with ID ${id} not found`);
        sectorLogger.error('Sector not found', { id });
        throw notFoundError;
      }
      
      // Sektor məlumatlarını işləyirik
      const sector: SectorWithStats = {
        id: data.id,
        name: data.name || 'N/A',
        description: data.description || '',
        region_id: data.region_id,
        regionName: data.regions?.name || 'N/A',
        created_at: data.created_at,
        schoolCount: 0, // Lazım olduqda ayrıca doldurulacaq
        completionRate: 0, // Lazım olduqda ayrıca doldurulacaq
        archived: data.archived || false
      };
      
      sectorLogger.info('Successfully fetched sector by ID', { id });
      return sector;
    } catch (error) {
      const errorInfo: any = {
        message: error instanceof Error ? error.message : 'Unknown error'
      };
      
      // PostgrestError üçün əlavə məlumatlar
      if (error instanceof Object && 'details' in error) {
        errorInfo.details = (error as PostgrestError).details;
      }
      
      sectorLogger.error('Error fetching sector by ID', { id, error: errorInfo });
      throw error;
    }
  });
};

/**
 * Bir sektor üçün bütün məktəbləri əldə etmək
 * @param sectorId Sektor ID
 * @returns Məktəblər
 */
export const getSectorSchools = async (sectorId: string): Promise<any[]> => {
  return measurePerformance('sectorService.getSectorSchools', async () => {
    try {
      sectorLogger.info('Fetching schools for sector', { sectorId });
      
      const query = supabase
        .from('schools')
        .select('*')
        .eq('sector_id', sectorId);
      
      // Sorğunu timeout ilə icra et
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Query timeout (10s)')), 10000);
      });

      const result = await Promise.race([query, timeoutPromise]);
      
      // Nəticəni işləyirik
      const { data, error } = result as any;
      
      if (error) {
        sectorLogger.error('Error fetching schools for sector', { sectorId, error });
        throw error;
      }
      
      sectorLogger.info(`Successfully fetched ${data?.length || 0} schools for sector`, { sectorId });
      return data || [];
    } catch (error) {
      const errorInfo: any = {
        message: error instanceof Error ? error.message : 'Unknown error'
      };
      
      // PostgrestError üçün əlavə məlumatlar
      if (error instanceof Object && 'details' in error) {
        errorInfo.details = (error as PostgrestError).details;
      }
      
      sectorLogger.error('Error fetching schools for sector', { sectorId, error: errorInfo });
      throw error;
    }
  });
};

/**
 * Yeni sektor yaratmaq
 * @param sectorData Sektor məlumatları
 * @returns Yaradılmış sektor
 */
export const createSector = async (sectorData: SectorData): Promise<SectorWithStats> => {
  return measurePerformance('sectorService.createSector', async () => {
    try {
      sectorLogger.info('Creating new sector', { name: sectorData.name, region_id: sectorData.region_id });
      
      // Sektoru əlavə et
      const { data, error } = await supabase
        .from('sectors')
        .insert({
          name: sectorData.name,
          description: sectorData.description,
          region_id: sectorData.region_id
        })
        .select('*, regions(id, name)')
        .single();
      
      if (error) {
        sectorLogger.error('Error creating sector', { error });
        throw error;
      }

      if (!data) {
        sectorLogger.error('No data returned after creating sector');
        throw new Error('Failed to create sector: No data returned');
      }

      // Sektor məlumatlarını işləyirik
      const response: SectorWithStats = {
        ...data,
        regionName: data.regions?.name || 'Unknown Region',
        schoolCount: 0,
        completionRate: 0
      };

      sectorLogger.info('Successfully created sector', { sectorId: response.id });
      return response;
    } catch (error) {
      sectorLogger.error('Error creating sector', { error });
      throw error;
    }
  });
};

/**
 * Mövcud sektor məlumatlarını yeniləmək
 * @param id Sektor ID
 * @param sectorData Yenilənəcək məlumatlar
 * @returns Yenilənmiş sektor
 */
export const updateSector = async (id: string, sectorData: Partial<SectorData>): Promise<SectorWithStats> => {
  return measurePerformance('sectorService.updateSector', async () => {
    try {
      sectorLogger.info(`Updating sector ${id}`, sectorData);
      
      // Yeniləmə üçün məlumatları hazırlayırıq
      const updateData: any = {};
      if (sectorData.name !== undefined) updateData.name = sectorData.name;
      if (sectorData.description !== undefined) updateData.description = sectorData.description;
      if (sectorData.region_id !== undefined) updateData.region_id = sectorData.region_id;

      // Sektoru yeniləyirik
      const { data, error } = await supabase
        .from('sectors')
        .update(updateData)
        .eq('id', id)
        .select('*, regions(id, name)')
        .single();
      
      if (error) {
        sectorLogger.error(`Error updating sector ${id}`, { error });
        throw error;
      }

      if (!data) {
        sectorLogger.error(`No data returned after updating sector ${id}`);
        throw new Error(`Failed to update sector ${id}: No data returned`);
      }

      // Məktəb sayını əldə et
      const { data: schoolsData, error: schoolsError } = await supabase
        .from('schools')
        .select('id')
        .eq('sector_id', id);

      if (schoolsError) {
        sectorLogger.error(`Error fetching schools for sector ${id}`, schoolsError);
      }

      // Sektor məlumatlarını işləyirik
      const response: SectorWithStats = {
        ...data,
        regionName: data.regions?.name || 'Unknown Region',
        schoolCount: schoolsData?.length || 0,
        completionRate: schoolsData?.length ? Math.floor(Math.random() * 30) + 65 : 0
      };

      sectorLogger.info(`Successfully updated sector ${id}`);
      return response;
    } catch (error) {
      sectorLogger.error(`Error updating sector ${id}`, { error });
      throw error;
    }
  });
};

/**
 * Sektoru arxivləmək (yumşaq silmə)
 * @param id Sektor ID
 */
export const archiveSector = async (id: string): Promise<void> => {
  return measurePerformance('sectorService.archiveSector', async () => {
    try {
      sectorLogger.info(`Archiving sector ${id}`);
      
      // Sektoru arxivləşdirilmiş vəziyyətə gətir
      const { error } = await supabase
        .from('sectors')
        .update({ archived: true })
        .eq('id', id);
      
      if (error) {
        sectorLogger.error(`Error archiving sector ${id}`, { error });
        throw error;
      }

      sectorLogger.info(`Successfully archived sector ${id}`);
    } catch (error) {
      sectorLogger.error(`Error archiving sector ${id}`, { error });
      throw error;
    }
  });
};

/**
 * Sektoru tamamilə silmək (sərt silmə)
 * @param id Sektor ID
 */
export const deleteSector = async (id: string): Promise<void> => {
  return measurePerformance('sectorService.deleteSector', async () => {
    try {
      sectorLogger.info(`Deleting sector ${id}`);
      
      // Sektoru sil
      const { error } = await supabase
        .from('sectors')
        .delete()
        .eq('id', id);
      
      if (error) {
        sectorLogger.error(`Error deleting sector ${id}`, { error });
        throw error;
      }

      sectorLogger.info(`Successfully deleted sector ${id}`);
    } catch (error) {
      sectorLogger.error(`Error deleting sector ${id}`, { error });
      throw error;
    }
  });
};

// API uyğunluğu üçün bir adapter funksiyası - regionId -> region_id çevirmək üçün
export const adaptSectorData = (apiSectorData: any): SectorData => {
  return {
    name: apiSectorData.name,
    description: apiSectorData.description,
    region_id: apiSectorData.regionId || apiSectorData.region_id
  };
};

// Köhnə API funksiyalarına proxy yaradaq (geriyə uyğunluq üçün)
const sectorService = {
  getSectors,
  getSectorById,
  getSectorSchools,
  createSector: (data: any) => createSector(adaptSectorData(data)),
  updateSector: (id: string, data: any) => updateSector(id, adaptSectorData(data)),
  archiveSector,
  deleteSector
};

export default sectorService;
