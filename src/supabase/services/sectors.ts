
/**
 * Sektor servis funksiyaları
 * Bütün sektor əməliyyatları üçün mərkəzi servis faylı
 */
import { supabase, handleSupabaseError, withRetry, measurePerformance, queryWithCache, checkConnection, isOfflineMode } from '../client';
import { TABLES, CACHE_CONFIG } from '../config';
import { 
  PaginationParams, 
  SortParams, 
  FilterParams
} from '../types';
import { 
  Sector,
  SectorWithStats, 
  CreateSectorDto, 
  UpdateSectorDto,
  SectorFilters
} from '../types/sector';
import { logInfo, logError, logDebug } from '../utils/logger';

/**
 * Sektor siyahısını alır
 */
export const getSectors = async (
  pagination?: PaginationParams,
  sort?: SortParams,
  filters?: SectorFilters
): Promise<{ data: SectorWithStats[]; count: number }> => {
  return await measurePerformance('getSectors', async () => {
    await checkConnection();
    try {
      // Count sorğusu
      const countQuery = supabase
        .from(TABLES.SECTORS)
        .select('id', { count: 'exact' });
        
      if (filters?.search) {
        countQuery.or(`name.ilike.%${filters.search}%`);
      }
    
      if (filters?.region_id) {
        countQuery.eq('region_id', filters.region_id);
      }
    
      const { count, error: countError } = await countQuery;
      
      if (countError) throw countError;
      
      // Əsas məlumat sorğusu
      let query = supabase
        .from(TABLES.SECTORS)
        .select(`
          *,
          regions:${TABLES.REGIONS}(id, name),
          schools:${TABLES.SCHOOLS}(id)
        `);
      
      // Axtarış filtri
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%`);
      }
    
      // Region filtri
      if (filters?.region_id) {
        query = query.eq('region_id', filters.region_id);
      }
    
      // Status filtri
      if (filters?.status && filters.status !== 'all') {
        if (filters.status === 'inactive') {
          query = query.eq('archived', true);
        } else if (filters.status === 'active') {
          query = query.eq('archived', false);
        }
      }
    
      // Sıralama
      if (sort?.field) {
        query = query.order(sort.field, { ascending: sort.direction === 'asc' });
      } else {
        query = query.order('name', { ascending: true });
      }
    
      // Səhifələmə
      if (pagination) {
        const { page, pageSize } = pagination;
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);
      }
    
      const { data, error } = await query;
      
      if (error) throw error;
    
      // Sektorları SectorWithStats formatına çeviririk
      const sectorsWithStats = (data || []).map(sector => ({
        id: sector.id,
        name: sector.name,
        region_id: sector.region_id,
        description: sector.description || '',
        code: '',
        created_at: sector.created_at,
        updated_at: sector.created_at,
        archived: sector.archived || false,
        regionName: sector.regions?.name || '',
        schoolCount: sector.schools ? sector.schools.length : 0,
        completionRate: Math.floor(Math.random() * 40) + 60, // Təsadüfi tamamlanma dərəcəsi (nümunə üçün)
        // Geriyə uyğunluq üçün köhnə adlar
        schools_count: sector.schools ? sector.schools.length : 0,
        completion_rate: Math.floor(Math.random() * 40) + 60,
        region: sector.regions?.name || ''
      })) as SectorWithStats[];
    
      return { data: sectorsWithStats, count: count || 0 };
    } catch (error) {
      logError('Sektorları alma xətası', error);
      throw handleSupabaseError(error, 'Sektorları alma');
    }
  });
}
};

/**
 * Sektor məlumatlarını ID ilə alır
 */
export const getSectorById = async (id: string): Promise<Sector> => {
  return await measurePerformance(`getSectorById:${id}`, async () => {
    await checkConnection();
    try { {
    const { data, error } = await supabase
      .from(TABLES.SECTORS)
      .select(`
        *,
        regions:${TABLES.REGIONS}(id, name)
      `)
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
      return {
        id: data.id,
        name: data.name,
        region_id: data.region_id,
        description: data.description || '',
        code: '',
        created_at: data.created_at,
        updated_at: data.created_at,
        archived: data.archived || false,
        region: data.regions?.name || ''
      } as Sector;
    } catch (error) {
      logError(`Sektor alma xətası (ID: ${id})`, error);
      throw handleSupabaseError(error, 'Sektor alma');
    }
  });
}
};

/**
 * Region üzrə sektorları almaq
 */
export const getSectorsByRegionId = async (regionId: string): Promise<Sector[]> => {
  return await measurePerformance(`getSectorsByRegionId:${regionId}`, async () => {
    await checkConnection();
    try { {
    const { data, error } = await supabase
      .from(TABLES.SECTORS)
      .select('*')
      .eq('region_id', regionId)
      .order('name');
      
    if (error) throw error;
    
      return (data || []).map(sector => ({
        id: sector.id,
        name: sector.name,
        region_id: sector.region_id,
        description: sector.description || '',
        code: '',
        created_at: sector.created_at,
        updated_at: sector.created_at,
        archived: sector.archived || false
      })) as Sector[];
    } catch (error) {
      logError(`Region üzrə sektorları alma xətası (Region ID: ${regionId})`, error);
      throw handleSupabaseError(error, 'Region üzrə sektorları alma');
    }
  });
}
};

/**
 * Yeni sektor yaratmaq
 */
export const createSector = async (sectorData: CreateSectorDto): Promise<Sector> => {
  return await measurePerformance('createSector', async () => {
    await checkConnection();
    try { {
    const { data, error } = await supabase
      .from(TABLES.SECTORS)
      .insert({
        name: sectorData.name,
        region_id: sectorData.region_id,
        code: sectorData.code || '',
        description: sectorData.description || ''
      })
      .select()
      .single();
      
    if (error) throw error;
    
      return data as Sector;
    } catch (error) {
      logError('Sektor yaratma xətası', error);
      throw handleSupabaseError(error, 'Sektor yaratma');
    }
  });
}
};

/**
 * Sektor məlumatlarını yeniləmək
 */
export const updateSector = async (id: string, sectorData: UpdateSectorDto): Promise<Sector> => {
  return await measurePerformance(`updateSector:${id}`, async () => {
    await checkConnection();
    try { {
    const { data, error } = await supabase
      .from(TABLES.SECTORS)
      .update({
        name: sectorData.name,
        region_id: sectorData.region_id,
        code: sectorData.code || '',
        description: sectorData.description || '',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
      return data as Sector;
    } catch (error) {
      logError(`Sektor yeniləmə xətası (ID: ${id})`, error);
      throw handleSupabaseError(error, 'Sektor yeniləmə');
    }
  });
}
};

/**
 * Sektoru silmək (arxivləşdirmək)
 */
export const deleteSector = async (id: string): Promise<boolean> => {
  return await measurePerformance(`deleteSector:${id}`, async () => {
    await checkConnection();
    try { {
    const { error } = await supabase
      .from(TABLES.SECTORS)
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
      return true;
    } catch (error) {
      logError(`Sektor silmə xətası (ID: ${id})`, error);
      throw handleSupabaseError(error, 'Sektor silmə');
    }
  });
}
};

/**
 * Dropdown üçün sektor siyahısı
 */
export const getSectorsForDropdown = async (): Promise<{ id: string; name: string }[]> => {
  return await queryWithCache('sectorsDropdown', async () => {
    await checkConnection();
    try { {
    const { data, error } = await supabase
      .from(TABLES.SECTORS)
      .select('id, name')
      .order('name');
      
    if (error) throw error;
    
    return data as { id: string; name: string }[];
  } catch (error) {
    logger.error('Sektor dropdown məlumatları alma xətası:', error);
    throw handleSupabaseError(error, 'Sektor dropdown məlumatları alma');
  }
};
