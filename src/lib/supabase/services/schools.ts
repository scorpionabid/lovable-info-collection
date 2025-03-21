
/**
 * Məktəb servis funksiyaları
 */
import { supabase, handleSupabaseError, withRetry } from '../client';
import { TABLES } from '../config';
import { 
  School,
  SchoolType,
  SchoolFilter,
  SchoolSortParams,
  CreateSchoolDto,
  UpdateSchoolDto
} from '../types';
import { logger } from '@/utils/logger';

/**
 * Məktəb siyahısını alır
 */
export const getSchools = async (filters?: SchoolFilter): Promise<School[]> => {
  try {
    let query = supabase
      .from(TABLES.SCHOOLS)
      .select(`
        id, name, address, code, type_id, region_id, sector_id, 
        created_at, updated_at, status,
        regions:${TABLES.REGIONS}(id, name),
        sectors:${TABLES.SECTORS}(id, name)
      `);
    
    // Filterləri tətbiq edirik
    if (filters) {
      // Axtarış
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,code.ilike.%${filters.search}%`);
      }
      
      // Region filtri
      if (filters.region_id || filters.regionId) {
        const regionId = filters.region_id || filters.regionId;
        if (regionId) {
          query = query.eq('region_id', regionId);
        }
      }
      
      // Sektor filtri
      if (filters.sector_id || filters.sectorId) {
        const sectorId = filters.sector_id || filters.sectorId;
        if (sectorId) {
          query = query.eq('sector_id', sectorId);
        }
      }
      
      // Tip filtri
      if (filters.type_id || filters.type) {
        const typeId = filters.type_id || filters.type;
        if (typeId) {
          query = query.eq('type_id', typeId);
        }
      }
      
      // Status filtri
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
    }

    // Sıralama
    if (filters?.sort_field) {
      query = query.order(filters.sort_field, { ascending: filters.sort_direction === 'asc' });
    } else if (filters?.sort?.field) {
      query = query.order(filters.sort.field, { ascending: filters.sort.direction === 'asc' });
    } else {
      query = query.order('name');
    }

    const { data, error } = await query;
    
    if (error) throw error;

    // Məktəbləri School formatına çeviririk və əskik sahələri defolt dəyərlərlə doldururuq
    return (data || []).map(school => ({
      id: school.id,
      name: school.name,
      code: school.code || '',
      type_id: school.type_id || '',
      region_id: school.region_id,
      sector_id: school.sector_id,
      address: school.address || '',
      status: school.status || 'Aktiv',
      created_at: school.created_at,
      updated_at: school.updated_at,
      
      // Əlaqəli data
      region: school.regions?.name || 'Naməlum',
      sector: school.sectors?.name || 'Naməlum',
      type: school.type_id || '',
      
      // Default dəyərlər
      student_count: 0,
      teacher_count: 0,
      director: 'N/A',
      email: 'N/A',
      phone: 'N/A',
      
      // Virtual sahələr
      completionRate: Math.floor(Math.random() * 40) + 60 // Təsadüfi tamamlanma dərəcəsi (nümunə üçün)
    }));
  } catch (error) {
    logger.error('Məktəbləri alma xətası:', error);
    throw handleSupabaseError(error, 'Məktəbləri alma');
  }
};

/**
 * Məktəb məlumatlarını ID ilə alır
 */
export const getSchoolById = async (id: string): Promise<School | null> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.SCHOOLS)
      .select(`
        *,
        regions:${TABLES.REGIONS}(id, name),
        sectors:${TABLES.SECTORS}(id, name)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) return null;
    
    // Tam School obyekti yaradırıq
    return {
      id: data.id,
      name: data.name,
      code: data.code || '',
      type_id: data.type_id || '',
      region_id: data.region_id,
      sector_id: data.sector_id,
      address: data.address || '',
      status: data.status || 'Aktiv',
      director: data.director || 'N/A',
      email: data.email || 'N/A',
      phone: data.phone || 'N/A',
      student_count: data.student_count || 0,
      teacher_count: data.teacher_count || 0,
      created_at: data.created_at,
      updated_at: data.updated_at,
      region: data.regions?.name || 'Naməlum',
      sector: data.sectors?.name || 'Naməlum',
      type: data.type_id || '',
      completionRate: Math.floor(Math.random() * 40) + 60 // Təsadüfi tamamlanma dərəcəsi (nümunə üçün)
    };
  } catch (error) {
    logger.error(`Məktəb alma xətası (ID: ${id}):`, error);
    return null;
  }
};

/**
 * Məktəb və admini birlikdə almaq
 */
export const getSchoolWithAdmin = async (id: string): Promise<{school: School, admin: any} | null> => {
  try {
    const school = await getSchoolById(id);
    
    if (!school) return null;

    const roleResult = await supabase.from(TABLES.ROLES).select('id').eq('name', 'school-admin').single();
    
    let adminData = null;
    if (!roleResult.error && roleResult.data) {
      const { data: adminResult, error: adminError } = await supabase
        .from(TABLES.USERS)
        .select(`
          id,
          first_name,
          last_name,
          email,
          phone,
          role_id,
          roles:${TABLES.ROLES}(name)
        `)
        .eq('school_id', id)
        .eq('role_id', roleResult.data.id)
        .maybeSingle();

      if (adminError && adminError.code !== 'PGRST116') {
        console.warn('Admin məlumatları alınarkən xəta:', adminError);
      } else {
        adminData = adminResult;
      }
    }

    const adminName = adminData ? `${adminData.first_name} ${adminData.last_name}` : null;

    return { 
      school: {
        ...school,
        adminName,
        adminId: adminData?.id || null
      }, 
      admin: adminData || null 
    };
  } catch (error) {
    logger.error(`Məktəb və admin məlumatları alma xətası (ID: ${id}):`, error);
    return null;
  }
};

/**
 * Məktəb növlərini almaq
 */
export const getSchoolTypes = async (): Promise<SchoolType[]> => {
  try {
    // RPC funksiyasından istifadə edirik
    const { data, error } = await supabase.rpc('get_school_types');
    
    if (error) throw error;
    
    return data as SchoolType[];
  } catch (error) {
    logger.error('Məktəb növlərini alma xətası:', error);
    throw handleSupabaseError(error, 'Məktəb növlərini alma');
  }
};

/**
 * Region üzrə məktəbləri almaq
 */
export const getSchoolsByRegionId = async (regionId: string): Promise<School[]> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.SCHOOLS)
      .select(`
        id, name, address, code, type_id, region_id, sector_id, 
        created_at, updated_at,
        regions:${TABLES.REGIONS}(id, name),
        sectors:${TABLES.SECTORS}(id, name)
      `)
      .eq('region_id', regionId);
    
    if (error) throw error;

    // Map school data
    return (data || []).map(school => ({
      id: school.id,
      name: school.name,
      code: school.code || '',
      type_id: school.type_id || '',
      region_id: school.region_id,
      sector_id: school.sector_id,
      address: school.address || '',
      created_at: school.created_at,
      updated_at: school.updated_at,
      
      // Əlaqəli data
      region: school.regions?.name || 'Naməlum',
      sector: school.sectors?.name || 'Naməlum',
      type: school.type_id || '',
      
      // Default dəyərlər
      student_count: 0,
      teacher_count: 0,
      status: 'Active',
      director: 'N/A',
      email: 'N/A',
      phone: 'N/A',
      
      // Virtual sahələr
      completionRate: Math.floor(Math.random() * 40) + 60
    }));
  } catch (error) {
    logger.error(`Region üzrə məktəbləri alma xətası (Region ID: ${regionId}):`, error);
    throw handleSupabaseError(error, 'Region üzrə məktəbləri alma');
  }
};

/**
 * Sektor üzrə məktəbləri almaq
 */
export const getSchoolsBySectorId = async (sectorId: string): Promise<School[]> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.SCHOOLS)
      .select(`
        id, name, address, code, type_id, region_id, sector_id, 
        created_at, updated_at,
        regions:${TABLES.REGIONS}(id, name),
        sectors:${TABLES.SECTORS}(id, name)
      `)
      .eq('sector_id', sectorId);
    
    if (error) throw error;

    // Map school data
    return (data || []).map(school => ({
      id: school.id,
      name: school.name,
      code: school.code || '',
      type_id: school.type_id || '',
      region_id: school.region_id,
      sector_id: school.sector_id,
      address: school.address || '',
      created_at: school.created_at,
      updated_at: school.updated_at,
      
      // Əlaqəli data
      region: school.regions?.name || 'Naməlum',
      sector: school.sectors?.name || 'Naməlum',
      type: school.type_id || '',
      
      // Default dəyərlər
      student_count: 0,
      teacher_count: 0,
      status: 'Active',
      director: 'N/A',
      email: 'N/A',
      phone: 'N/A',
      
      // Virtual sahələr
      completionRate: Math.floor(Math.random() * 40) + 60
    }));
  } catch (error) {
    logger.error(`Sektor üzrə məktəbləri alma xətası (Sektor ID: ${sectorId}):`, error);
    throw handleSupabaseError(error, 'Sektor üzrə məktəbləri alma');
  }
};

/**
 * Yeni məktəb yaratmaq
 */
export const createSchool = async (schoolData: CreateSchoolDto): Promise<School> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.SCHOOLS)
      .insert(schoolData)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as School;
  } catch (error) {
    logger.error('Məktəb yaratma xətası:', error);
    throw handleSupabaseError(error, 'Məktəb yaratma');
  }
};

/**
 * Məktəb məlumatlarını yeniləmək
 */
export const updateSchool = async (id: string, schoolData: UpdateSchoolDto): Promise<School> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.SCHOOLS)
      .update(schoolData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as School;
  } catch (error) {
    logger.error(`Məktəb yeniləmə xətası (ID: ${id}):`, error);
    throw handleSupabaseError(error, 'Məktəb yeniləmə');
  }
};

/**
 * Məktəbi silmək (arxivləşdirmək)
 */
export const deleteSchool = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(TABLES.SCHOOLS)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    logger.error(`Məktəb silmə xətası (ID: ${id}):`, error);
    throw handleSupabaseError(error, 'Məktəb silmə');
  }
};

/**
 * Dropdown üçün məktəb siyahısı
 */
export const getSchoolsForDropdown = async (
  regionId?: string,
  sectorId?: string
): Promise<{ id: string; name: string }[]> => {
  try {
    let query = supabase.from(TABLES.SCHOOLS).select('id, name');
    
    // Filterləri tətbiq edirik
    if (sectorId) {
      query = query.eq('sector_id', sectorId);
    }
    
    if (regionId) {
      query = query.eq('region_id', regionId);
    }
    
    const { data, error } = await query.order('name');
    
    if (error) throw error;
    
    return data as { id: string; name: string }[];
  } catch (error) {
    logger.error('Məktəb dropdown məlumatları alma xətası:', error);
    throw handleSupabaseError(error, 'Məktəb dropdown məlumatları alma');
  }
};
