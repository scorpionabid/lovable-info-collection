
import { supabase } from '../../supabase/supabaseClient';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

const authCore = {
  login: async (credentials: LoginCredentials) => {
    try {
      console.log('Attempting login with:', credentials.email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      
      if (error) {
        console.error('Supabase auth error:', error);
        throw error;
      }
      
      console.log('Auth successful, fetching user data');
      
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*, roles(*)')
        .eq('email', credentials.email)
        .single();
      
      if (userError) {
        console.error('User data fetch error:', userError);
        throw userError;
      }
      
      console.log('User data fetched successfully');
      
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
  
  register: async (credentials: RegisterCredentials) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            first_name: credentials.firstName,
            last_name: credentials.lastName,
          }
        }
      });
      
      if (error) throw error;
      
      const { error: userError } = await supabase
        .from('users')
        .insert([
          { 
            email: credentials.email,
            first_name: credentials.firstName,
            last_name: credentials.lastName,
            role_id: credentials.role || 'user',
            is_active: true
          }
        ]);
      
      if (userError) throw userError;
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
};

export default authCore;
