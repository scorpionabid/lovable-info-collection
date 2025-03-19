/**
 * Auth xidməti - istifadəçi autentifikasiyası və avtorizasiyası üçün
 */
import { supabase, handleSupabaseError } from '@/lib/supabase';
import { User, Role } from '@/types/supabase';
import { logger } from '@/utils/logger';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleId: string;
  regionId?: string;
  sectorId?: string;
  schoolId?: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export interface AuthResponse {
  user: User | null;
  token: string | null;
  error?: string;
}

/**
 * Auth xidməti
 */
const authService = {
  /**
   * İstifadəçi girişi
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      // Supabase Auth ilə giriş
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      
      if (error) {
        logger.error('Auth xətası:', error);
        return { user: null, token: null, error: error.message };
      }
      
      // Uğurlu autentifikasiyadan sonra istifadəçi profilini əldə et
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*, roles(*)')
        .eq('email', credentials.email)
        .single();
      
      if (userError) {
        logger.error('İstifadəçi məlumatları əldə etmə xətası:', userError);
        return { user: null, token: null, error: userError.message };
      }
      
      // Son giriş tarixini yenilə
      const { error: updateError } = await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('email', credentials.email);
        
      if (updateError) {
        logger.warn('Son giriş tarixini yeniləmə xətası:', updateError);
        // Bloklanmayan xəta, girişə davam et
      }
      
      return {
        token: data.session?.access_token || null,
        user: userData as User
      };
    } catch (error) {
      logger.error('Giriş xidməti xətası:', error);
      return { user: null, token: null, error: 'Giriş zamanı xəta baş verdi' };
    }
  },
  
  /**
   * Çıxış
   */
  logout: async (): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        logger.error('Çıxış xətası:', error);
        throw error;
      }
      return true;
    } catch (error) {
      logger.error('Çıxış xətası:', error);
      return false;
    }
  },
  
  /**
   * Şifrəni unutdum
   */
  forgotPassword: async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        logger.error('Şifrə sıfırlama xətası:', error);
        throw error;
      }
      return true;
    } catch (error) {
      logger.error('Şifrə sıfırlama xətası:', error);
      return false;
    }
  },
  
  /**
   * Şifrəni yenilə
   */
  resetPassword: async (data: ResetPasswordData): Promise<boolean> => {
    try {
      // Supabase yönləndirildikdə token doğrulamasını avtomatik idarə edir
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      });
      
      if (error) {
        logger.error('Şifrə yeniləmə xətası:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      logger.error('Şifrə yeniləmə xətası:', error);
      return false;
    }
  },
  
  /**
   * Cari istifadəçini əldə et
   */
  getCurrentUser: async (): Promise<User | null> => {
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
        .select('*, roles(*)')
        .eq('email', user.email)
        .single();
      
      if (profileError) {
        logger.error('Profil əldə etmə xətası:', profileError);
        return null;
      }
      
      return data as User;
    } catch (error) {
      logger.error('Cari istifadəçi xətası:', error);
      return null;
    }
  },
  
  /**
   * İstifadəçi icazələrini əldə et
   */
  getUserPermissions: async (): Promise<string[]> => {
    try {
      // Əvvəlcə autentifikasiya olunmuş istifadəçini əldə et
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        logger.error('Auth xətası:', error);
        return [];
      }
      if (!user) return [];
      
      // İstifadəçinin rolunu və icazələrini əldə et
      const { data, error: roleError } = await supabase
        .from('users')
        .select('role_id, roles(permissions)')
        .eq('email', user.email)
        .single();
      
      if (roleError) {
        logger.error('Rol əldə etmə xətası:', roleError);
        return [];
      }
      
      // İcazələr roles obyektindədir
      if (data?.roles) {
        // Roles massiv olub-olmadığını yoxla
        if (Array.isArray(data.roles)) {
          // Massivdə elementlər varsa, icazələrə təhlükəsiz giriş
          if (data.roles.length > 0) {
            const firstRole = data.roles[0];
            // Permissions mövcud olduğunu və əlçatan olduğunu yoxlamaq üçün tip yoxlaması
            if (firstRole && typeof firstRole === 'object' && 'permissions' in firstRole) {
              return firstRole.permissions as string[];
            }
          }
        } 
        // Roles massiv deyil, obyektdirsə
        else if (data.roles && typeof data.roles === 'object') {
          // TypeScript-in strukturu başa düşməsi üçün tip təsdiqi
          const rolesObj = data.roles as { permissions?: string[] };
          if (rolesObj.permissions) {
            return rolesObj.permissions;
          }
        }
      }
      
      return [];
    } catch (error) {
      logger.error('İcazələr əldə etmə xətası:', error);
      return [];
    }
  },

  /**
   * İstifadəçi qeydiyyatı
   */
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    try {
      // Əvvəlcə Supabase Auth ilə istifadəçi yarat
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
      });
      
      if (authError) {
        logger.error('Qeydiyyat xətası:', authError);
        return { user: null, token: null, error: authError.message };
      }
      
      if (!authData.user) {
        return { user: null, token: null, error: 'İstifadəçi yaradıla bilmədi' };
      }
      
      // Sonra istifadəçi profilini yarat
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: credentials.email,
          first_name: credentials.firstName,
          last_name: credentials.lastName,
          role_id: credentials.roleId,
          region_id: credentials.regionId,
          sector_id: credentials.sectorId,
          school_id: credentials.schoolId,
          is_active: true
        })
        .select()
        .single();
      
      if (userError) {
        logger.error('İstifadəçi profili yaratma xətası:', userError);
        // Auth istifadəçisi yaradıldı, amma profil yaradıla bilmədi
        // İdeal olaraq, auth istifadəçisini silmək lazımdır, amma Supabase-də bunu etmək üçün admin hüquqları lazımdır
        return { user: null, token: null, error: userError.message };
      }
      
      return {
        token: authData.session?.access_token || null,
        user: userData as User
      };
    } catch (error) {
      logger.error('Qeydiyyat xidməti xətası:', error);
      return { user: null, token: null, error: 'Qeydiyyat zamanı xəta baş verdi' };
    }
  },

  /**
   * Rolları əldə et
   */
  getRoles: async (): Promise<Role[]> => {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('name');
      
      if (error) {
        logger.error('Rolları əldə etmə xətası:', error);
        throw error;
      }
      
      return data as Role[];
    } catch (error) {
      logger.error('Rolları əldə etmə xətası:', error);
      return [];
    }
  }
};

export default authService;
