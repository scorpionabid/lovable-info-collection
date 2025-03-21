
/**
 * Sectors servisi
 * Sektorlarla bağlı bütün əməliyyatlar
 */
import { supabase, withRetry, handleSupabaseError } from '../client';
import { TABLE_NAMES } from '../config';
import { queryWithCache } from '../utils/cache';
import { logger } from '@/utils/logger';

// Sektor tipi
export interface Sector {
  id: string;
  name: string;
  region_id: string;
  description?: string;
  code?: string;
  created_at: string;
  updated_at?: string;
  archived?: boolean;
}

// Sektor statistikalarla
export interface SectorWithStats extends Sector {
  schoolCount: number;
  completionRate: number;
  regionName?: string;
}

// Sorğu parametrləri
export interface SectorFilters {
  search?: string;
  region_id?: string;
  status?: 'active' | 'inactive' | 'all';
  completionRate?: string;
}

export interface SortParams {
  column: string;
  direction: 'asc' | 'desc';
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

// Bütün sektorları almaq
export const getSectors = async (
  pagination?: PaginationParams,
  sort?: SortParams,
  filters?: SectorFilters
): Promise<{ data: SectorWithStats[]; count: number }> => {
  try {
    let query = supabase
      .from(TABLE_NAMES.SECTORS)
      .select('*, regions:regions(id, name), schools:schools(id)', { count: 'exact' });

    // Filterlər tətbiq olunur
    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }
    
    if (filters?.region_id) {
      query = query.eq('region_id', filters.region_id);
    }

    if (filters?.status === 'active') {
      query = query.eq('archived', false);
    } else if (filters?.status === 'inactive') {
      query = query.eq('archived', true);
    }

    // Sıralama tətbiq olunur
    if (sort?.column) {
      query = query.order(sort.column, { ascending: sort.direction === 'asc' });
    } else {
      query = query.order('name', { ascending: true });
    }

    // Səhifələmə tətbiq olunur
    if (pagination) {
      const from = (pagination.page - 1) * pagination.pageSize;
      const to = from + pagination.pageSize - 1;
      query = query.range(from, to);
    }

    const { data, count, error } = await query;

    if (error) throw error;

    // Sektorları SectorWithStats formatına çevirmək
    const sectorsWithStats: SectorWithStats[] = (data || []).map(sector => ({
      id: sector.id,
      name: sector.name,
      region_id: sector.region_id,
      description: sector.description || '',
      code: sector.code || '',
      created_at: sector.created_at,
      updated_at: sector.updated_at,
      archived: sector.archived || false,
      schoolCount: sector.schools ? sector.schools.length : 0,
      completionRate: 0, // Bu məlumatı hesablamaq üçün əlavə sorğu lazımdır
      regionName: sector.regions?.name
    }));

    return { data: sectorsWithStats, count: count || 0 };
  } catch (error) {
    logger.error('Sektorları alma xətası:', error);
    throw handleSupabaseError(error, 'Sektorları alma');
  }
};

// ID ilə sektor almaq
export const getSectorById = async (id: string): Promise<Sector> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAMES.SECTORS)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Sektor tapılmadı');

    return {
      id: data.id,
      name: data.name,
      region_id: data.region_id,
      description: data.description || '',
      code: data.code || '',
      created_at: data.created_at,
      updated_at: data.updated_at,
      archived: data.archived || false
    };
  } catch (error) {
    logger.error(`Sektor alma xətası (ID: ${id}):`, error);
    throw handleSupabaseError(error, 'Sektor alma');
  }
};

// Region ID ilə sektorları almaq
export const getSectorsByRegionId = async (regionId: string): Promise<Sector[]> => {
  try {
    const cacheKey = `sectors_by_region_${regionId}`;
    
    // Keşdən oxumaq üçün cəhd
    const data = await queryWithCache<Sector[]>(cacheKey, () => 
      supabase
        .from(TABLE_NAMES.SECTORS)
        .select('*')
        .eq('region_id', regionId)
        .order('name')
    );

    return data.map(sector => ({
      ...sector,
      description: sector.description || '',
      archived: sector.archived || false
    }));
  } catch (error) {
    logger.error(`Region üzrə sektorları alma xətası (Region ID: ${regionId}):`, error);
    throw handleSupabaseError(error, 'Region üzrə sektorları alma');
  }
};

// Sektor yaratmaq
export const createSector = async (sectorData: Partial<Sector>): Promise<Sector> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAMES.SECTORS)
      .insert({
        name: sectorData.name,
        region_id: sectorData.region_id,
        description: sectorData.description,
        code: sectorData.code
      })
      .select()
      .single();

    if (error) throw error;
    return data as Sector;
  } catch (error) {
    logger.error('Sektor yaratma xətası:', error);
    throw handleSupabaseError(error, 'Sektor yaratma');
  }
};

// Sektor yeniləmək
export const updateSector = async (id: string, sectorData: Partial<Sector>): Promise<Sector> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAMES.SECTORS)
      .update({
        name: sectorData.name,
        region_id: sectorData.region_id,
        description: sectorData.description,
        code: sectorData.code,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Sector;
  } catch (error) {
    logger.error(`Sektor yeniləmə xətası (ID: ${id}):`, error);
    throw handleSupabaseError(error, 'Sektor yeniləmə');
  }
};

// Sektor silmək
export const deleteSector = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(TABLE_NAMES.SECTORS)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    logger.error(`Sektor silmə xətası (ID: ${id}):`, error);
    throw handleSupabaseError(error, 'Sektor silmə');
  }
};

// Sektor arxivləşdirmək
export const archiveSector = async (id: string, archive: boolean = true): Promise<Sector> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAMES.SECTORS)
      .update({
        archived: archive,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Sector;
  } catch (error) {
    logger.error(`Sektor arxivləşdirmə xətası (ID: ${id}):`, error);
    throw handleSupabaseError(error, 'Sektor arxivləşdirmə');
  }
};

// Dropdown üçün sadə sektor siyahısı
export const getSectorsForDropdown = async (regionId?: string): Promise<{id: string; name: string}[]> => {
  try {
    const cacheKey = regionId 
      ? `sectors_dropdown_region_${regionId}` 
      : 'sectors_dropdown_all';
    
    let query = supabase
      .from(TABLE_NAMES.SECTORS)
      .select('id, name');
    
    if (regionId) {
      query = query.eq('region_id', regionId);
    }
    
    return await queryWithCache<{id: string; name: string}[]>(
      cacheKey, 
      () => query.order('name')
    );
  } catch (error) {
    logger.error('Sektor siyahısı alma xətası:', error);
    throw handleSupabaseError(error, 'Sektor siyahısı alma');
  }
};
