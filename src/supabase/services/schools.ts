
/**
 * Schools servisi
 * Məktəblərlə bağlı bütün əməliyyatlar
 */
import { supabase, withRetry, handleSupabaseError } from '../client';
import { TABLE_NAMES } from '../config';
import { queryWithCache } from '../utils/cache';
import { logger } from '@/utils/logger';

// Məktəb tipi
export interface School {
  id: string;
  name: string;
  code: string;
  region_id: string;
  sector_id: string;
  type_id: string;
  address: string;
  director?: string;
  email?: string;
  phone?: string;
  status?: string;
  student_count?: number;
  teacher_count?: number;
  created_at: string;
  updated_at?: string;
  archived?: boolean;

  // Əlaqəli obyektlərdən gələn məlumatlar
  region?: string;
  sector?: string;
  type?: string;
  
  // Hesablanmış məlumatlar
  completionRate?: number;
  
  // Alternativ adlar (UI üçün)
  studentCount?: number;
  teacherCount?: number;
  contactEmail?: string;
  contactPhone?: string;
}

// Məktəb statistikalarla
export interface SchoolWithStats extends School {
  completionRate: number;
}

// Sorğu parametrləri
export interface SchoolFilter {
  search?: string;
  region_id?: string;
  sector_id?: string;
  type_id?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface SchoolSortParams {
  field: string;
  direction: 'asc' | 'desc';
}

// Məktəb yaratmaq üçün DTO
export interface CreateSchoolDto {
  name: string;
  code: string;
  region_id: string;
  sector_id: string;
  type_id: string;
  address: string;
  director?: string;
  email?: string;
  phone?: string;
  status?: string;
  student_count?: number;
  teacher_count?: number;
}

// Məktəb yeniləmək üçün DTO
export interface UpdateSchoolDto {
  name?: string;
  code?: string;
  region_id?: string;
  sector_id?: string;
  type_id?: string;
  address?: string;
  director?: string;
  email?: string;
  phone?: string;
  status?: string;
  student_count?: number;
  teacher_count?: number;
  archived?: boolean;
}

// Bütün məktəbləri almaq
export const getSchools = async (
  filters?: SchoolFilter,
  sort?: SchoolSortParams
): Promise<School[]> => {
  try {
    let query = supabase
      .from(TABLE_NAMES.SCHOOLS)
      .select(`
        *,
        regions:${TABLE_NAMES.REGIONS}(name),
        sectors:${TABLE_NAMES.SECTORS}(name),
        school_types:${TABLE_NAMES.SCHOOL_TYPES}(name)
      `);

    // Filterlər tətbiq olunur
    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }
    
    if (filters?.region_id) {
      query = query.eq('region_id', filters.region_id);
    }
    
    if (filters?.sector_id) {
      query = query.eq('sector_id', filters.sector_id);
    }
    
    if (filters?.type_id) {
      query = query.eq('type_id', filters.type_id);
    }
    
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    // Sıralama tətbiq olunur
    if (sort?.field) {
      query = query.order(sort.field, { ascending: sort.direction === 'asc' });
    } else {
      query = query.order('name', { ascending: true });
    }

    const { data, error } = await query;

    if (error) throw error;

    // Məktəbləri School formatına çevirmək
    return (data || []).map(school => transformSchoolData(school));
  } catch (error) {
    logger.error('Məktəbləri alma xətası:', error);
    throw handleSupabaseError(error, 'Məktəbləri alma');
  }
};

// ID ilə məktəb almaq
export const getSchoolById = async (id: string): Promise<School | null> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAMES.SCHOOLS)
      .select(`
        *,
        regions:${TABLE_NAMES.REGIONS}(name),
        sectors:${TABLE_NAMES.SECTORS}(name),
        school_types:${TABLE_NAMES.SCHOOL_TYPES}(name)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return transformSchoolData(data);
  } catch (error) {
    logger.error(`Məktəb alma xətası (ID: ${id}):`, error);
    return null;
  }
};

// Region ID ilə məktəbləri almaq
export const getSchoolsByRegion = async (regionId: string): Promise<School[]> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAMES.SCHOOLS)
      .select(`
        *,
        regions:${TABLE_NAMES.REGIONS}(name),
        sectors:${TABLE_NAMES.SECTORS}(name),
        school_types:${TABLE_NAMES.SCHOOL_TYPES}(name)
      `)
      .eq('region_id', regionId);

    if (error) throw error;
    return (data || []).map(school => transformSchoolData(school));
  } catch (error) {
    logger.error(`Region üzrə məktəbləri alma xətası (Region ID: ${regionId}):`, error);
    throw handleSupabaseError(error, 'Region üzrə məktəbləri alma');
  }
};

// Sector ID ilə məktəbləri almaq
export const getSchoolsBySector = async (sectorId: string): Promise<School[]> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAMES.SCHOOLS)
      .select(`
        *,
        regions:${TABLE_NAMES.REGIONS}(name),
        sectors:${TABLE_NAMES.SECTORS}(name),
        school_types:${TABLE_NAMES.SCHOOL_TYPES}(name)
      `)
      .eq('sector_id', sectorId);

    if (error) throw error;
    return (data || []).map(school => transformSchoolData(school));
  } catch (error) {
    logger.error(`Sektor üzrə məktəbləri alma xətası (Sektor ID: ${sectorId}):`, error);
    throw handleSupabaseError(error, 'Sektor üzrə məktəbləri alma');
  }
};

// Məktəb yaratmaq
export const createSchool = async (schoolData: CreateSchoolDto): Promise<School | null> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAMES.SCHOOLS)
      .insert([schoolData])
      .select(`
        *,
        regions:${TABLE_NAMES.REGIONS}(name),
        sectors:${TABLE_NAMES.SECTORS}(name),
        school_types:${TABLE_NAMES.SCHOOL_TYPES}(name)
      `)
      .single();
    
    if (error) throw error;
    return transformSchoolData(data);
  } catch (error) {
    logger.error('Məktəb yaratma xətası:', error);
    return null;
  }
};

// Məktəb yeniləmək
export const updateSchool = async (id: string, schoolData: UpdateSchoolDto): Promise<School | null> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAMES.SCHOOLS)
      .update(schoolData)
      .eq('id', id)
      .select(`
        *,
        regions:${TABLE_NAMES.REGIONS}(name),
        sectors:${TABLE_NAMES.SECTORS}(name),
        school_types:${TABLE_NAMES.SCHOOL_TYPES}(name)
      `)
      .single();
    
    if (error) throw error;
    return transformSchoolData(data);
  } catch (error) {
    logger.error(`Məktəb yeniləmə xətası (ID: ${id}):`, error);
    return null;
  }
};

// Məktəb silmək (soft delete)
export const deleteSchool = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(TABLE_NAMES.SCHOOLS)
      .update({ archived: true })
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    logger.error(`Məktəb silmə xətası (ID: ${id}):`, error);
    return false;
  }
};

// Məktəb məlumatlarını düzgün formata çevirmək
function transformSchoolData(schoolData: any): School {
  if (!schoolData) return null;
  
  return {
    id: schoolData.id,
    name: schoolData.name,
    code: schoolData.code,
    region_id: schoolData.region_id,
    sector_id: schoolData.sector_id,
    type_id: schoolData.type_id,
    address: schoolData.address || '',
    director: schoolData.director || '',
    email: schoolData.email || '',
    phone: schoolData.phone || '',
    status: schoolData.status || 'active',
    student_count: schoolData.student_count || 0,
    teacher_count: schoolData.teacher_count || 0,
    created_at: schoolData.created_at,
    updated_at: schoolData.updated_at,
    archived: schoolData.archived || false,
    
    // Əlaqəli obyektlərdən gələn məlumatlar
    region: schoolData.regions?.name || '',
    sector: schoolData.sectors?.name || '',
    type: schoolData.school_types?.name || '',
    
    // Hesablanmış məlumatlar
    completionRate: 0, // Bu sonradan hesablanacaq
    
    // UI üçün alternativ adlar
    studentCount: schoolData.student_count || 0,
    teacherCount: schoolData.teacher_count || 0,
    contactEmail: schoolData.email || '',
    contactPhone: schoolData.phone || ''
  };
}

// Dropdown üçün sadə məktəb siyahısı
export const getSchoolsForDropdown = async (
  sectorId?: string, 
  regionId?: string
): Promise<{id: string; name: string}[]> => {
  try {
    let cacheKey = 'schools_dropdown';
    if (sectorId) cacheKey += `_sector_${sectorId}`;
    if (regionId) cacheKey += `_region_${regionId}`;
    
    let query = supabase
      .from(TABLE_NAMES.SCHOOLS)
      .select('id, name');
    
    if (sectorId) {
      query = query.eq('sector_id', sectorId);
    }
    
    if (regionId) {
      query = query.eq('region_id', regionId);
    }
    
    return await queryWithCache<{id: string; name: string}[]>(
      cacheKey, 
      () => query.order('name')
    );
  } catch (error) {
    logger.error('Məktəb siyahısı alma xətası:', error);
    throw handleSupabaseError(error, 'Məktəb siyahısı alma');
  }
};

// Məktəb tipləri
export const getSchoolTypes = async (): Promise<{id: string; name: string}[]> => {
  try {
    const cacheKey = 'school_types';
    
    return await queryWithCache<{id: string; name: string}[]>(
      cacheKey,
      () => supabase
        .from(TABLE_NAMES.SCHOOL_TYPES)
        .select('id, name')
        .order('name')
    );
  } catch (error) {
    logger.error('Məktəb tipləri alma xətası:', error);
    throw handleSupabaseError(error, 'Məktəb tipləri alma');
  }
};
