import { supabase } from '@/integrations/supabase/client';

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
      // First check if user already exists in auth system
      const { data: existingAuthUser, error: checkError } = await supabase.auth.admin.getUserById(credentials.email);
      
      // If check throws an unexpected error, it's likely an invalid request, not a missing user
      // Continue with registration but log the error
      if (checkError && !checkError.message.includes('User not found')) {
        console.warn('Check user existence warning:', checkError);
      }
      
      // Proceed with registration if user doesn't exist
      if (!existingAuthUser?.user) {
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
        
        // Validate role_id is a valid UUID
        if (credentials.role && !(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(credentials.role))) {
          throw new Error('Invalid role ID format');
        }
        
        // Create user profile with role - use upsert to handle race conditions
        const { error: userError } = await supabase
          .from('users')
          .upsert([
            { 
              id: data.user?.id,
              email: credentials.email,
              first_name: credentials.firstName,
              last_name: credentials.lastName,
              role_id: credentials.role, // This should be a valid UUID
              is_active: true
            }
          ], {
            onConflict: 'id'
          });
        
        if (userError) throw userError;
        
        return data;
      } else {
        // User already exists, throw meaningful error
        throw new Error('User with this email already exists');
      }
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
