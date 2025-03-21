
/**
 * Auth servisi
 * Autentifikasiya ilə bağlı bütün əməliyyatlar
 */
import { supabase, handleSupabaseError } from '../client';
import { logger } from '@/utils/logger';

// Login üçün məlumatlar
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserSession {
  user: any;
  session: any;
}

// Login olmaq
export const login = async (credentials: LoginCredentials): Promise<UserSession> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    
    if (error) throw error;
    
    logger.info('İstifadəçi uğurla daxil oldu:', { email: credentials.email });
    
    return data;
  } catch (error) {
    logger.error('Login xətası:', error);
    throw handleSupabaseError(error, 'Login');
  }
};

// Çıxış etmək
export const logout = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    
    logger.info('İstifadəçi çıxış etdi');
  } catch (error) {
    logger.error('Çıxış xətası:', error);
    throw handleSupabaseError(error, 'Çıxış');
  }
};

// Cari sessiya məlumatlarını almaq
export const getSession = async (): Promise<any> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    return data.session;
  } catch (error) {
    logger.error('Sessiya alma xətası:', error);
    throw handleSupabaseError(error, 'Sessiya alma');
  }
};

// Cari istifadəçini almaq
export const getCurrentUser = async (): Promise<any> => {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    
    return data.user;
  } catch (error) {
    logger.error('Cari istifadəçi alma xətası:', error);
    throw handleSupabaseError(error, 'Cari istifadəçi alma');
  }
};

// Şifrə sıfırlama linki göndərmək
export const sendPasswordResetEmail = async (email: string): Promise<void> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    
    if (error) throw error;
    
    logger.info('Şifrə sıfırlama linki göndərildi:', { email });
  } catch (error) {
    logger.error('Şifrə sıfırlama linki göndərmə xətası:', error);
    throw handleSupabaseError(error, 'Şifrə sıfırlama linki göndərmə');
  }
};

// Şifrəni dəyişmək
export const changePassword = async (newPassword: string): Promise<void> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) throw error;
    
    logger.info('Şifrə uğurla dəyişdirildi');
  } catch (error) {
    logger.error('Şifrə dəyişmə xətası:', error);
    throw handleSupabaseError(error, 'Şifrə dəyişmə');
  }
};

// Token yeniləmək
export const refreshToken = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.refreshSession();
    
    if (error) throw error;
    
    logger.debug('Token uğurla yeniləndi');
  } catch (error) {
    logger.error('Token yeniləmə xətası:', error);
    throw handleSupabaseError(error, 'Token yeniləmə');
  }
};

// Auth hadisələrinə qulaq asmaq
export const subscribeToAuthChanges = (callback: (event: string, session: any) => void): { unsubscribe: () => void } => {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
  
  return data.subscription;
};

// İstifadəçinin rolunu yoxlamaq
export const hasRole = async (role: string): Promise<boolean> => {
  try {
    const { data } = await supabase.auth.getUser();
    
    if (!data.user) return false;
    
    // Role məlumatı user_metadata içində olmalıdır
    const userRole = data.user.user_metadata?.role || '';
    
    return userRole === role;
  } catch (error) {
    logger.error('Rol yoxlama xətası:', error);
    return false;
  }
};
