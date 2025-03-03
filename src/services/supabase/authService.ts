
import { supabase, User } from './supabaseClient';

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
    // Using Supabase Auth
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
    
    return {
      token: data.session?.access_token,
      user: userData
    };
  },
  
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  },
  
  forgotPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/password-reset`,
    });
    
    if (error) throw error;
    return true;
  },
  
  resetPassword: async (data: ResetPasswordData) => {
    // In the real flow, Supabase handles the token validation automatically when redirected
    const { error } = await supabase.auth.updateUser({
      password: data.newPassword
    });
    
    if (error) throw error;
    return true;
  },
  
  getCurrentUser: async () => {
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
  },
  
  getUserPermissions: async () => {
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
    // Fix: access permissions properly from the roles object, not as an array
    return data?.roles?.permissions || [];
  }
};

export default authService;
