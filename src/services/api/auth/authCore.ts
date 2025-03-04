
import { supabase } from '../../supabase/supabaseClient';

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
};

export type ResetPasswordData = {
  token: string;
  newPassword: string;
};

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
      
      // First, fetch the user data without joining roles
      // This avoids the foreign key relationship error
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', credentials.email)
        .single();
      
      if (userError) {
        console.error('User data fetch error:', userError);
        throw userError;
      }
      
      // If role_id exists, fetch the role separately
      let roleData = null;
      if (userData && userData.role_id) {
        const { data: roleResult, error: roleError } = await supabase
          .from('roles')
          .select('*')
          .eq('id', userData.role_id)
          .maybeSingle(); // Use maybeSingle instead of single to avoid errors if no role is found
          
        if (!roleError && roleResult) {
          roleData = roleResult;
        }
      }
      
      // Combine user and role data
      const combinedUserData = {
        ...userData,
        roles: roleData
      };
      
      console.log('User data fetched successfully');
      
      localStorage.setItem('token', data.session?.access_token || '');
      localStorage.setItem('user', JSON.stringify(combinedUserData));
      
      return {
        token: data.session?.access_token,
        user: combinedUserData
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
