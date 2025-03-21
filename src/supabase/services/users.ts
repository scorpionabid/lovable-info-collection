
/**
 * İstifadəçi servis funksiyaları
 */
import { supabase, handleSupabaseError, withRetry } from '../client';
import { TABLES } from '../config';
import { 
  User, 
  UserWithRole, 
  UserFilters, 
  CreateUserDto, 
  UpdateUserDto 
} from '../types';
import { logger } from '@/utils/logger';

/**
 * İstifadəçi siyahısını alır
 */
export const getUsers = async (filters?: UserFilters): Promise<User[]> => {
  try {
    let query = supabase
      .from(TABLES.USERS)
      .select(`
        *,
        roles:${TABLES.ROLES}(id, name, permissions)
      `);
    
    // Filterləri tətbiq edirik
    if (filters?.search) {
      query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }
    
    if (filters?.role_id) {
      query = query.eq('role_id', filters.role_id);
    }
    
    if (filters?.region_id) {
      query = query.eq('region_id', filters.region_id);
    }
    
    if (filters?.sector_id) {
      query = query.eq('sector_id', filters.sector_id);
    }
    
    if (filters?.school_id) {
      query = query.eq('school_id', filters.school_id);
    }
    
    if (filters?.status) {
      if (filters.status === 'active') {
        query = query.eq('is_active', true);
      } else if (filters.status === 'inactive' || filters.status === 'blocked') {
        query = query.eq('is_active', false);
      }
    }

    // Sıralama
    query = query.order('last_name', { ascending: true });
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // İstifadəçiləri User formatına çeviririk və rol adını əlavə edirik
    return (data || []).map(user => {
      const roleName = user.roles?.name || '';
      return {
        ...user,
        roleName
      };
    });
  } catch (error) {
    logger.error('İstifadəçiləri alma xətası:', error);
    throw handleSupabaseError(error, 'İstifadəçiləri alma');
  }
};

/**
 * İstifadəçi məlumatlarını ID ilə alır
 */
export const getUserById = async (id: string): Promise<UserWithRole | null> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select(`
        *,
        roles:${TABLES.ROLES}(id, name, description, permissions)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return {
      ...data,
      role: data.roles
    };
  } catch (error) {
    logger.error(`İstifadəçi alma xətası (ID: ${id}):`, error);
    return null;
  }
};

/**
 * UTIS kodu mövcudluğunu yoxlamaq
 */
export const checkUtisCodeExists = async (utisCode: string, userId?: string): Promise<boolean> => {
  try {
    let query = supabase
      .from(TABLES.USERS)
      .select('id')
      .eq('utis_code', utisCode);
    
    if (userId) {
      query = query.neq('id', userId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return (data || []).length > 0;
  } catch (error) {
    logger.error(`UTIS kodu yoxlama xətası (${utisCode}):`, error);
    throw handleSupabaseError(error, 'UTIS kodu yoxlama');
  }
};

/**
 * İstifadəçi yaratmaq
 */
export const createUser = async (userData: CreateUserDto): Promise<User> => {
  try {
    // Əvvəlcə auth.users cədvəlində istifadəçi yaradılır
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password || Math.random().toString(36).slice(2, 10),
      options: {
        data: {
          first_name: userData.first_name,
          last_name: userData.last_name,
          role_id: userData.role_id
        }
      }
    });
    
    if (authError) throw authError;
    
    if (!authData.user) {
      throw new Error('İstifadəçi yaradıla bilmədi');
    }
    
    // Əlavə məlumatları yeniləyirik
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .update({
        role_id: userData.role_id,
        region_id: userData.region_id,
        sector_id: userData.sector_id,
        school_id: userData.school_id,
        phone: userData.phone,
        utis_code: userData.utis_code,
        is_active: userData.is_active !== undefined ? userData.is_active : true
      })
      .eq('id', authData.user.id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as User;
  } catch (error) {
    logger.error('İstifadəçi yaratma xətası:', error);
    throw handleSupabaseError(error, 'İstifadəçi yaratma');
  }
};

/**
 * İstifadəçi məlumatlarını yeniləmək
 */
export const updateUser = async (id: string, userData: UpdateUserDto): Promise<User> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .update({
        first_name: userData.first_name,
        last_name: userData.last_name,
        role_id: userData.role_id,
        region_id: userData.region_id,
        sector_id: userData.sector_id,
        school_id: userData.school_id,
        phone: userData.phone,
        utis_code: userData.utis_code,
        is_active: userData.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Auth metadata yeniləyirik
    await supabase.auth.updateUser({
      data: {
        first_name: userData.first_name,
        last_name: userData.last_name,
        role_id: userData.role_id
      }
    });
    
    return data as User;
  } catch (error) {
    logger.error(`İstifadəçi yeniləmə xətası (ID: ${id}):`, error);
    throw handleSupabaseError(error, 'İstifadəçi yeniləmə');
  }
};

/**
 * İstifadəçini silmək
 */
export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.admin.deleteUser(id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    logger.error(`İstifadəçi silmə xətası (ID: ${id}):`, error);
    throw handleSupabaseError(error, 'İstifadəçi silmə');
  }
};

/**
 * İstifadəçini bloklamaq
 */
export const blockUser = async (id: string): Promise<User> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .update({
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;

    // Auth tərəfində də bloklamaq
    await supabase.auth.admin.updateUserById(id, {
      user_metadata: { is_active: false }
    });
    
    return data as User;
  } catch (error) {
    logger.error(`İstifadəçi bloklama xətası (ID: ${id}):`, error);
    throw handleSupabaseError(error, 'İstifadəçi bloklama');
  }
};

/**
 * İstifadəçini aktivləşdirmək
 */
export const activateUser = async (id: string): Promise<User> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .update({
        is_active: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Auth tərəfində də aktivləşdirmək
    await supabase.auth.admin.updateUserById(id, {
      user_metadata: { is_active: true }
    });
    
    return data as User;
  } catch (error) {
    logger.error(`İstifadəçi aktivləşdirmə xətası (ID: ${id}):`, error);
    throw handleSupabaseError(error, 'İstifadəçi aktivləşdirmə');
  }
};

/**
 * Şifrəni sıfırlamaq
 */
export const resetPassword = async (id: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('email')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(data.email);
    
    if (resetError) throw resetError;
    
    return true;
  } catch (error) {
    logger.error(`Şifrə sıfırlama xətası (ID: ${id}):`, error);
    throw handleSupabaseError(error, 'Şifrə sıfırlama');
  }
};

/**
 * Rolları almaq
 */
export const getRoles = async (): Promise<{id: string; name: string}[]> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.ROLES)
      .select('id, name')
      .order('name');
    
    if (error) throw error;
    
    return data as {id: string; name: string}[];
  } catch (error) {
    logger.error('Rolları alma xətası:', error);
    throw handleSupabaseError(error, 'Rolları alma');
  }
};
