
import { supabase } from './supabaseClient';

export interface LoginCredentials {
  email: string;
  password: string;
}

export const login = async (credentials: LoginCredentials) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Login error:', error);
    return { data: null, error };
  }
};

export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error };
  }
};

export const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { session: data.session, error: null };
  } catch (error) {
    console.error('Get session error:', error);
    return { session: null, error };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user: data.user, error: null };
  } catch (error) {
    console.error('Get current user error:', error);
    return { user: null, error };
  }
};

export const sendPasswordResetEmail = async (email: string) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Password reset email error:', error);
    return { success: false, error };
  }
};

export const changePassword = async (newPassword: string) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Change password error:', error);
    return { success: false, error };
  }
};

// Helper to check user's role
export const hasRole = (userRole: string, requiredRole: string): boolean => {
  if (!userRole) return false;
  
  // Define role hierarchy
  const roleHierarchy = {
    'super-admin': 4,
    'region-admin': 3,
    'sector-admin': 2,
    'school-admin': 1,
    'user': 0
  };
  
  // Get numeric values for comparison
  const userRoleLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
  const requiredRoleLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;
  
  // Check if user has sufficient permissions
  return userRoleLevel >= requiredRoleLevel;
};
