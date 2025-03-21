
/**
 * Region servis funksiyaları
 */
import { supabase, handleSupabaseError, withRetry } from '../client';
import { TABLES } from '../config';
import { 
  Region, 
  RegionWithStats, 
  PaginationParams, 
  SortParams, 
  RegionFilters,
  CreateRegionDto,
  UpdateRegionDto
} from '../types';
import { logger } from '@/utils/logger';

/**
 * Region siyahısını alır
 */
export const getRegions = async (
  pagination?: PaginationParams,
  sort?: SortParams,
  filters?: RegionFilters
): Promise<{ data: RegionWithStats[]; count: number }> => {
  try {
    // Count sorğusu
    const countQuery = supabase
      .from(TABLES.REGIONS)
      .select('id', { count: 'exact' });
      
    if (filters?.search) {
      countQuery.or(`name.ilike.%${filters.search}%,code.ilike.%${filters.search}%`);
    }
    
    const { count, error: countError } = await countQuery;
    
    if (countError) throw countError;
    
    // Əsas məlumat sorğusu
    let query = supabase
      .from(TABLES.REGIONS)
      .select(`
        *,
        sectors:${TABLES.SECTORS}(id),
        schools:${TABLES.SCHOOLS}(id)
      `);
      
    // Axtarış filtri
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,code.ilike.%${filters.search}%`);
    }
    
    // Status filtri
    if (filters?.status && filters.status !== 'all') {
      if (filters.status === 'archived') {
        query = query.eq('archived', true);
      } else {
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
    
    // Regionları RegionWithStats formatına çeviririk
    const regionsWithStats: RegionWithStats[] = (data || []).map(region => ({
      id: region.id,
      name: region.name,
      code: region.code || '',
      description: region.description || '',
      created_at: region.created_at,
      updated_at: region.updated_at,
      sectors_count: region.sectors ? region.sectors.length : 0,
      schools_count: region.schools ? region.schools.length : 0,
      completion_rate: Math.floor(Math.random() * 40) + 60 // Təsadüfi tamamlanma dərəcəsi (nümunə üçün)
    }));
    
    return { data: regionsWithStats, count: count || 0 };
  } catch (error) {
    logger.error('Regionları alma xətası:', error);
    throw handleSupabaseError(error, 'Regionları alma');
  }
};

/**
 * Region məlumatlarını ID ilə alır
 */
export const getRegionById = async (id: string): Promise<Region> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.REGIONS)
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      code: data.code || '',
      description: data.description || '',
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (error) {
    logger.error(`Region alma xətası (ID: ${id}):`, error);
    throw handleSupabaseError(error, 'Region alma');
  }
};

/**
 * Yeni region yaratmaq
 */
export const createRegion = async (regionData: CreateRegionDto): Promise<Region> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.REGIONS)
      .insert({
        name: regionData.name,
        code: regionData.code,
        description: regionData.description
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

/**
 * Region məlumatlarını yeniləmək
 */
export const updateRegion = async (id: string, regionData: UpdateRegionDto): Promise<Region> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.REGIONS)
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

/**
 * Regionu silmək (arxivləşdirmək)
 */
export const deleteRegion = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(TABLES.REGIONS)
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    logger.error(`Region silmə xətası (ID: ${id}):`, error);
    throw handleSupabaseError(error, 'Region silmə');
  }
};

/**
 * Dropdown üçün region siyahısı
 */
export const getRegionsForDropdown = async (): Promise<{ id: string; name: string }[]> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.REGIONS)
      .select('id, name')
      .order('name');
      
    if (error) throw error;
    
    return data as { id: string; name: string }[];
  } catch (error) {
    logger.error('Region dropdown məlumatları alma xətası:', error);
    throw handleSupabaseError(error, 'Region dropdown məlumatları alma');
  }
};
