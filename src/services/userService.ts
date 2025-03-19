/**
 * İstifadəçi xidməti - istifadəçilərin idarə edilməsi üçün
 */
import { supabase, withRetry } from '@/lib/supabase';
import { User } from '@/types/supabase';
import { logger } from '@/utils/logger';

export interface UserFilter {
  search?: string;
  roleId?: string;
  regionId?: string;
  sectorId?: string;
  schoolId?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
}

export interface UserResponse {
  data: User[] | null;
  count: number;
  error: any | null;
}

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleId: string;
  regionId?: string;
  sectorId?: string;
  schoolId?: string;
  phone?: string;
  utisCode?: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  roleId?: string;
  regionId?: string;
  sectorId?: string;
  schoolId?: string;
  phone?: string;
  utisCode?: string;
  isActive?: boolean;
}

/**
 * İstifadəçi xidməti
 */
const userService = {
  /**
   * İstifadəçiləri əldə et
   */
  getUsers: async (filters?: UserFilter): Promise<UserResponse> => {
    try {
      let query = supabase
        .from('users')
        .select(`
          *,
          roles:roles(id, name),
          regions:regions(id, name),
          sectors:sectors(id, name),
          schools:schools(id, name)
        `, { count: 'exact' });
      
      // Filtrləri tətbiq et
      if (filters) {
        if (filters.search) {
          query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
        }
        if (filters.roleId) {
          query = query.eq('role_id', filters.roleId);
        }
        if (filters.regionId) {
          query = query.eq('region_id', filters.regionId);
        }
        if (filters.sectorId) {
          query = query.eq('sector_id', filters.sectorId);
        }
        if (filters.schoolId) {
          query = query.eq('school_id', filters.schoolId);
        }
        if (filters.isActive !== undefined) {
          query = query.eq('is_active', filters.isActive);
        }
      }
      
      // Sıralama
      query = query.order('created_at', { ascending: false });
      
      // Səhifələmə
      if (filters?.page && filters?.pageSize) {
        const from = (filters.page - 1) * filters.pageSize;
        const to = from + filters.pageSize - 1;
        query = query.range(from, to);
      }
      
      const { data, error, count } = await query;
      
      if (error) {
        logger.error('İstifadəçiləri əldə etmə xətası:', error);
        return { data: null, count: 0, error };
      }
      
      return { data: data as User[], count: count || 0, error: null };
    } catch (error) {
      logger.error('İstifadəçiləri əldə etmə xətası:', error);
      return { data: null, count: 0, error };
    }
  },
  
  /**
   * İstifadəçini ID ilə əldə et
   */
  getUserById: async (id: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          roles:roles(id, name),
          regions:regions(id, name),
          sectors:sectors(id, name),
          schools:schools(id, name)
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        logger.error('İstifadəçi əldə etmə xətası:', error);
        return null;
      }
      
      return data as User;
    } catch (error) {
      logger.error('İstifadəçi əldə etmə xətası:', error);
      return null;
    }
  },
  
  /**
   * Yeni istifadəçi yarat
   */
  createUser: async (userData: CreateUserDto): Promise<User | null> => {
    try {
      // Əvvəlcə Supabase Auth ilə istifadəçi yarat
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });
      
      if (authError) {
        logger.error('İstifadəçi yaratma xətası (auth):', authError);
        return null;
      }
      
      if (!authData.user) {
        logger.error('İstifadəçi yaradıla bilmədi');
        return null;
      }
      
      // Sonra istifadəçi profilini yarat
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: userData.email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          role_id: userData.roleId,
          region_id: userData.regionId,
          sector_id: userData.sectorId,
          school_id: userData.schoolId,
          phone: userData.phone,
          utis_code: userData.utisCode,
          is_active: true
        })
        .select()
        .single();
      
      if (error) {
        logger.error('İstifadəçi yaratma xətası (profil):', error);
        return null;
      }
      
      return data as User;
    } catch (error) {
      logger.error('İstifadəçi yaratma xətası:', error);
      return null;
    }
  },
  
  /**
   * İstifadəçini yenilə
   */
  updateUser: async (id: string, userData: UpdateUserDto): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          first_name: userData.firstName,
          last_name: userData.lastName,
          role_id: userData.roleId,
          region_id: userData.regionId,
          sector_id: userData.sectorId,
          school_id: userData.schoolId,
          phone: userData.phone,
          utis_code: userData.utisCode,
          is_active: userData.isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        logger.error('İstifadəçi yeniləmə xətası:', error);
        return null;
      }
      
      return data as User;
    } catch (error) {
      logger.error('İstifadəçi yeniləmə xətası:', error);
      return null;
    }
  },
  
  /**
   * İstifadəçi şifrəsini yenilə
   */
  resetUserPassword: async (id: string, newPassword: string): Promise<boolean> => {
    try {
      // Əvvəlcə istifadəçinin e-poçtunu əldə et
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email')
        .eq('id', id)
        .single();
      
      if (userError) {
        logger.error('İstifadəçi əldə etmə xətası:', userError);
        return false;
      }
      
      // Admin API ilə şifrəni yenilə
      // Qeyd: Bu, admin hüquqları tələb edir və real tətbiqdə fərqli ola bilər
      const { error } = await supabase.auth.admin.updateUserById(
        id,
        { password: newPassword }
      );
      
      if (error) {
        logger.error('Şifrə yeniləmə xətası:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      logger.error('Şifrə yeniləmə xətası:', error);
      return false;
    }
  },
  
  /**
   * İstifadəçini deaktiv et
   */
  deactivateUser: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: false })
        .eq('id', id);
      
      if (error) {
        logger.error('İstifadəçi deaktivasiya xətası:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      logger.error('İstifadəçi deaktivasiya xətası:', error);
      return false;
    }
  },
  
  /**
   * İstifadəçini aktiv et
   */
  activateUser: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: true })
        .eq('id', id);
      
      if (error) {
        logger.error('İstifadəçi aktivasiya xətası:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      logger.error('İstifadəçi aktivasiya xətası:', error);
      return false;
    }
  },
  
  /**
   * İstifadəçi profili əldə et
   */
  getUserProfile: async (): Promise<User | null> => {
    try {
      // Əvvəlcə autentifikasiya olunmuş istifadəçini əldə et
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        logger.error('Auth xətası:', error);
        return null;
      }
      if (!user) return null;
      
      // Sonra istifadəçi profilini əldə et
      const { data, error: profileError } = await supabase
        .from('users')
        .select(`
          *,
          roles:roles(id, name),
          regions:regions(id, name),
          sectors:sectors(id, name),
          schools:schools(id, name)
        `)
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        logger.error('Profil əldə etmə xətası:', profileError);
        return null;
      }
      
      return data as User;
    } catch (error) {
      logger.error('Profil əldə etmə xətası:', error);
      return null;
    }
  },
  
  /**
   * İstifadəçi profilini yenilə
   */
  updateUserProfile: async (userData: UpdateUserDto): Promise<User | null> => {
    try {
      // Əvvəlcə autentifikasiya olunmuş istifadəçini əldə et
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        logger.error('Auth xətası:', error);
        return null;
      }
      if (!user) return null;
      
      // Sonra istifadəçi profilini yenilə
      const { data, error: updateError } = await supabase
        .from('users')
        .update({
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();
      
      if (updateError) {
        logger.error('Profil yeniləmə xətası:', updateError);
        return null;
      }
      
      return data as User;
    } catch (error) {
      logger.error('Profil yeniləmə xətası:', error);
      return null;
    }
  },
  
  /**
   * İstifadəçi şifrəsini dəyişdir
   */
  changePassword: async (oldPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        logger.error('Şifrə dəyişdirmə xətası:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      logger.error('Şifrə dəyişdirmə xətası:', error);
      return false;
    }
  }
};

export default userService;
