
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
      
      // First, try to authenticate the user
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      
      if (error) {
        console.error('Supabase auth error:', error);
        throw error;
      }
      
      console.log('Auth successful, fetching user data');
      
      // Use let instead of const to allow reassignment
      let userRecord;
      
      // Get user profile with proper join on role_id
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          *,
          roles(
            id,
            name,
            description,
            permissions
          )
        `)
        .eq('email', credentials.email)
        .maybeSingle();
      
      if (userError) {
        console.error('User data fetch error:', userError);
        throw userError;
      }
      
      // If no user record found in the users table but auth was successful
      if (!userData) {
        console.log('Auth user exists but no corresponding record in users table, creating one...');
        
        // Get default role (superadmin)
        const { data: roleData, error: roleError } = await supabase
          .from('roles')
          .select('id')
          .eq('name', 'superadmin')
          .single();
          
        if (roleError) {
          console.error('Role fetch error:', roleError);
          throw roleError;
        }
        
        // Create user record
        const { data: newUserData, error: createError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user?.id,
              email: credentials.email,
              first_name: data.user?.user_metadata?.first_name || 'Super',
              last_name: data.user?.user_metadata?.last_name || 'Admin',
              role_id: roleData.id,
              is_active: true
            }
          ])
          .select(`
            *,
            roles(
              id,
              name,
              description,
              permissions
            )
          `)
          .single();
          
        if (createError) {
          console.error('User creation error:', createError);
          throw createError;
        }
        
        // Assign the newly created user data to our variable
        userRecord = newUserData;
      } else {
        // Use the existing user data
        userRecord = userData;
      }
      
      console.log('User data fetched successfully');
      
      localStorage.setItem('token', data.session?.access_token || '');
      localStorage.setItem('user', JSON.stringify(userRecord));
      
      return {
        token: data.session?.access_token,
        user: userRecord
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
      
      // Create user profile with role
      const { error: userError } = await supabase
        .from('users')
        .insert([
          { 
            id: data.user?.id,
            email: credentials.email,
            first_name: credentials.firstName,
            last_name: credentials.lastName,
            role_id: credentials.role || 'superadmin', // Default to superadmin for development
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
