
import { supabase } from '../supabase/supabaseClient';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

const authService = {
  login: async (credentials: LoginCredentials) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      
      if (error) throw error;
      
      // After successful auth, get the user profile from our custom users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*, roles(*)')
        .eq('email', credentials.email)
        .single();
      
      if (userError) throw userError;
      
      // Store token in localStorage
      localStorage.setItem('token', data.session?.access_token || '');
      localStorage.setItem('user', JSON.stringify(userData));
      
      return {
        token: data.session?.access_token,
        user: userData
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      // Remove token from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
  
  forgotPassword: async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/password-reset`,
      });
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  },
  
  resetPassword: async (data: ResetPasswordData) => {
    try {
      // In the real flow, Supabase handles the token validation automatically when redirected
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      });
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  },
  
  getCurrentUser: async () => {
    try {
      // First get the authenticated user
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      if (!user) return null;
      
      // Then get the user profile
      const { data, error: profileError } = await supabase
        .from('users')
        .select('*, roles(*)')
        .eq('email', user.email)
        .single();
      
      if (profileError) throw profileError;
      return data;
    } catch (error) {
      console.error('Get current user error:', error);
      return null; // Return null instead of throwing to prevent UI blocking
    }
  },
  
  getUserPermissions: async () => {
    try {
      // First get the authenticated user to get their role
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      if (!user) return [];
      
      // Get the user's role and permissions
      const { data, error: roleError } = await supabase
        .from('users')
        .select('role_id, roles(permissions)')
        .eq('email', user.email)
        .single();
      
      if (roleError) throw roleError;
      
      // Fix for TypeScript error - use proper type assertions and checks
      if (data?.roles) {
        // Check if roles is an array
        if (Array.isArray(data.roles)) {
          // Access permissions safely if array has items
          if (data.roles.length > 0) {
            const firstRole = data.roles[0];
            // Use type checking to ensure permissions exists and is accessible
            if (firstRole && typeof firstRole === 'object' && 'permissions' in firstRole) {
              return (firstRole as { permissions: string[] }).permissions;
            }
          }
        } 
        // If roles is not an array but an object
        else if (data.roles && typeof data.roles === 'object') {
          // Use type assertion to help TypeScript understand the structure
          const rolesObj = data.roles as { permissions?: string[] };
          if (rolesObj && rolesObj.permissions) {
            return rolesObj.permissions;
          }
        }
      }
      
      return [];
    } catch (error) {
      console.error('Get user permissions error:', error);
      return []; // Return empty array instead of throwing to prevent UI blocking
    }
  }
};

export default authService;
