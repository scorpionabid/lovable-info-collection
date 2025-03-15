import { supabase } from '@/integrations/supabase/client';

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
      // Using Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      
      if (error) {
        console.error('Auth error:', error);
        throw error;
      }
      
      // After successful auth, get the user profile from our custom users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*, roles(*)')
        .eq('email', credentials.email)
        .single();
      
      if (userError) {
        console.error('User fetch error:', userError);
        throw userError;
      }
      
      // Update last login timestamp
      const { error: updateError } = await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('email', credentials.email);
        
      if (updateError) {
        console.warn('Failed to update last_login:', updateError);
        // Non-blocking error, continue with login
      }
      
      return {
        token: data.session?.access_token,
        user: userData
      };
    } catch (error) {
      console.error('Login service error:', error);
      throw error;
    }
  },
  
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
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
      console.error('Password update error:', error);
      throw error;
    }
  },
  
  getCurrentUser: async () => {
    // First get the authenticated user
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Auth error:', error);
      throw error;
    }
    if (!user) return null;
    
    // Then get the user profile
    const { data, error: profileError } = await supabase
      .from('users')
      .select('*, roles(*)')
      .eq('email', user.email)
      .single();
    
    if (profileError) {
      console.error('Profile fetch error:', profileError);
      throw profileError;
    }
    
    return data;
  },
  
  getUserPermissions: async () => {
    try {
      // First get the authenticated user to get their role
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Auth error:', error);
        throw error;
      }
      if (!user) return [];
      
      // Get the user's role and permissions
      const { data, error: roleError } = await supabase
        .from('users')
        .select('role_id, roles(permissions)')
        .eq('email', user.email)
        .single();
      
      if (roleError) {
        console.error('Role fetch error:', roleError);
        throw roleError;
      }
      
      // The permissions are in the roles object
      if (data?.roles) {
        // Check if roles is an array
        if (Array.isArray(data.roles)) {
          // Access permissions safely if array has items
          if (data.roles.length > 0) {
            const firstRole = data.roles[0];
            // Use type checking to ensure permissions exists and is accessible
            if (firstRole && typeof firstRole === 'object' && 'permissions' in firstRole) {
              return firstRole.permissions as string[];
            }
          }
        } 
        // If roles is not an array but an object
        else if (data.roles && typeof data.roles === 'object') {
          // Use type assertion to help TypeScript understand the structure
          const rolesObj = data.roles as { permissions?: string[] };
          if (rolesObj.permissions) {
            return rolesObj.permissions;
          }
        }
      }
      
      return [];
    } catch (error) {
      console.error('Permissions fetch error:', error);
      return [];
    }
  }
};

export default authService;
