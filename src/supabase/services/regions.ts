
/**
 * Regions servisi
 * Regionlarla bağlı bütün əməliyyatlar
 */
import { supabase, withRetry, handleSupabaseError } from '../client';
import { TABLE_NAMES } from '../config';
import { queryWithCache } from '../utils/cache';
import { logger } from '@/utils/logger';

// Region tipi
export interface Region {
  id: string;
  name: string;
  code?: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}

// Region statistikalarla
export interface RegionWithStats extends Region {
  sectorCount: number;
  schoolCount: number;
  completionRate: number;
}

// Sorğu parametrləri
export interface RegionFilters {
  search?: string;
  code?: string;
  status?: 'active' | 'archived' | 'all';
  completionRate?: string;
}

export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

// Bütün regionları almaq
export const getRegions = async (
  pagination?: PaginationParams,
  sort?: SortParams,
  filters?: RegionFilters
): Promise<{ data: RegionWithStats[]; count: number }> => {
  try {
    let query = supabase
      .from(TABLE_NAMES.REGIONS)
      .select('*, sectors:sectors(id), schools:schools(id)', { count: 'exact' });

    // Filterlər tətbiq olunur
    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }
    
    if (filters?.code) {
      query = query.eq('code', filters.code);
    }

    // Sıralama tətbiq olunur
    if (sort?.field) {
      query = query.order(sort.field, { ascending: sort.direction === 'asc' });
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

    // Regionları RegionWithStats formatına çevirmək
    const regionsWithStats: RegionWithStats[] = (data || []).map(region => ({
      id: region.id,
      name: region.name,
      code: region.code || '',
      description: region.description || '',
      created_at: region.created_at,
      updated_at: region.updated_at,
      sectorCount: region.sectors ? region.sectors.length : 0,
      schoolCount: region.schools ? region.schools.length : 0,
      completionRate: 0 // Bu məlumatı hesablamaq üçün əlavə sorğu lazımdır
    }));

    return { data: regionsWithStats, count: count || 0 };
  } catch (error) {
    logger.error('Regionları alma xətası:', error);
    throw handleSupabaseError(error, 'Regionları alma');
  }
};

// ID ilə region almaq
export const getRegionById = async (id: string): Promise<Region> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAMES.REGIONS)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Region tapılmadı');

    return {
      id: data.id,
      name: data.name,
      code: data.code || '',
      description: data.description || '',
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    logger.error(`Region alma xətası (ID: ${id}):`, error);
    throw handleSupabaseError(error, 'Region alma');
  }
};

// Region yaratmaq
export const createRegion = async (regionData: Partial<Region>): Promise<Region> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAMES.REGIONS)
      .insert({
        name: regionData.name,
        code: regionData.code,
        description: regionData.description,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Region;
  } catch (error) {
    logger.error('Region yaratma xətası:', error);
    throw handleSupabaseError(error, 'Region yaratma');
  }
};

// Region yeniləmək
export const updateRegion = async (id: string, regionData: Partial<Region>): Promise<Region> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAMES.REGIONS)
      .update({
        name: regionData.name,
        code: regionData.code,
        description: regionData.description,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Region;
  } catch (error) {
    logger.error(`Region yeniləmə xətası (ID: ${id}):`, error);
    throw handleSupabaseError(error, 'Region yeniləmə');
  }
};

// Region silmək
export const deleteRegion = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(TABLE_NAMES.REGIONS)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    logger.error(`Region silmə xətası (ID: ${id}):`, error);
    throw handleSupabaseError(error, 'Region silmə');
  }
};

// Dropdown üçün sadə region siyahısı
export const getRegionsForDropdown = async (): Promise<{id: string; name: string}[]> => {
  try {
    const cacheKey = 'regions_dropdown';
    
    return await queryWithCache(cacheKey, () => 
      supabase
        .from(TABLE_NAMES.REGIONS)
        .select('id, name')
        .order('name')
    );
  } catch (error) {
    logger.error('Regon siyahısı alma xətası:', error);
    throw handleSupabaseError(error, 'Region siyahısı alma');
  }
};
