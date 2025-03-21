
/**
 * Users servisi
 * İstifadəçilərlə bağlı bütün əməliyyatlar
 */
import { supabase, withRetry, handleSupabaseError } from '../client';
import { TABLE_NAMES } from '../config';
import { queryWithCache } from '../utils/cache';
import { logger } from '@/utils/logger';

// İstifadəçi tipi
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role_id: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  phone?: string;
  utis_code?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  last_login?: string;
  
  // Əlaqəli obyektlərdən gələn məlumatlar
  role?: string | { id: string; name: string; permissions: string[] };
  roleName?: string;
}

// Rolla birlikdə istifadəçi tipi
export interface UserWithRole extends User {
  role: {
    id: string;
    name: string;
    description?: string;
    permissions: string[];
  };
}

// İstifadəçi filtri
export interface UserFilters {
  search?: string;
  role_id?: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  status?: 'active' | 'inactive' | 'all';
}

// İstifadəçi yaratmaq üçün DTO
export interface CreateUserDto {
  email: string;
  first_name: string;
  last_name: string;
  role_id: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  phone?: string;
  utis_code?: string;
  password?: string;
  is_active?: boolean;
}

// İstifadəçi yeniləmək üçün DTO
export interface UpdateUserDto {
  first_name?: string;
  last_name?: string;
  role_id?: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  phone?: string;
  utis_code?: string;
  is_active?: boolean;
}

// Bütün istifadəçiləri almaq
export const getUsers = async (filters?: UserFilters): Promise<User[]> => {
  try {
    let query = supabase
      .from(TABLE_NAMES.USERS)
      .select(`
        *,
        roles:${TABLE_NAMES.ROLES}(id, name, permissions)
      `);
    
    // Filterlər tətbiq olunur
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
      } else if (filters.status === 'inactive') {
        query = query.eq('is_active', false);
      }
    }

    query = query.order('last_name', { ascending: true });
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // İstifadəçiləri User formatına çevirmək və rol adını əlavə etmək
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

// ID ilə istifadəçi almaq
export const getUserById = async (id: string): Promise<UserWithRole | null> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAMES.USERS)
      .select(`
        *,
        roles:${TABLE_NAMES.ROLES}(id, name, description, permissions)
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

// UTIS kodu mövcudluğunu yoxlamaq
export const checkUtisCodeExists = async (utisCode: string, userId?: string): Promise<boolean> => {
  try {
    let query = supabase
      .from(TABLE_NAMES.USERS)
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

// İstifadəçi yaratmaq
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
    
    // users cədvəlində istifadəçi məlumatları saxlanılır (trigger ilə avtomatik yaradılır)
    // Əlavə məlumatları yeniləmək üçün
    const { data, error } = await supabase
      .from(TABLE_NAMES.USERS)
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

// İstifadəçi yeniləmək
export const updateUser = async (id: string, userData: UpdateUserDto): Promise<User> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAMES.USERS)
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
    
    // Auth məlumatlarını da yeniləmək
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

// İstifadəçi silmək
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

// İstifadəçini bloklamaq
export const blockUser = async (id: string): Promise<User> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAMES.USERS)
      .update({
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Auth tərəfdə də bloklamaq
    await supabase.auth.admin.updateUserById(id, {
      banned: true
    });
    
    return data as User;
  } catch (error) {
    logger.error(`İstifadəçi bloklama xətası (ID: ${id}):`, error);
    throw handleSupabaseError(error, 'İstifadəçi bloklama');
  }
};

// İstifadəçini aktivləşdirmək
export const activateUser = async (id: string): Promise<User> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAMES.USERS)
      .update({
        is_active: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Auth tərəfdə də aktivləşdirmək
    await supabase.auth.admin.updateUserById(id, {
      banned: false
    });
    
    return data as User;
  } catch (error) {
    logger.error(`İstifadəçi aktivləşdirmə xətası (ID: ${id}):`, error);
    throw handleSupabaseError(error, 'İstifadəçi aktivləşdirmə');
  }
};

// Şifrəni sıfırlamaq
export const resetPassword = async (id: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAMES.USERS)
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

// Rolları almaq
export const getRoles = async (): Promise<{id: string; name: string}[]> => {
  try {
    const cacheKey = 'roles';
    
    return await queryWithCache<{id: string; name: string}[]>(
      cacheKey,
      () => supabase
        .from(TABLE_NAMES.ROLES)
        .select('id, name')
        .order('name')
    );
  } catch (error) {
    logger.error('Rolları alma xətası:', error);
    throw handleSupabaseError(error, 'Rolları alma');
  }
};
