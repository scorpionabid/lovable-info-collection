
import { supabase } from '../supabase/supabaseClient';

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

const authService = {
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
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      if (!user) return null;
      
      const { data, error: profileError } = await supabase
        .from('users')
        .select('*, roles(*)')
        .eq('email', user.email)
        .single();
      
      if (profileError) throw profileError;
      return data;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },
  
  getUserPermissions: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      if (!user) return [];
      
      const { data, error: roleError } = await supabase
        .from('users')
        .select('role_id, roles(permissions)')
        .eq('email', user.email)
        .single();
      
      if (roleError) throw roleError;
      
      if (data?.roles) {
        if (Array.isArray(data.roles)) {
          if (data.roles.length > 0) {
            const firstRole = data.roles[0];
            if (firstRole && typeof firstRole === 'object' && 'permissions' in firstRole) {
              return (firstRole as { permissions: string[] }).permissions;
            }
          }
        } else if (data.roles && typeof data.roles === 'object') {
          const rolesObj = data.roles as { permissions?: string[] };
          if (rolesObj && rolesObj.permissions) {
            return rolesObj.permissions;
          }
        }
      }
      
      return [];
    } catch (error) {
      console.error('Get user permissions error:', error);
      return [];
    }
  },
  
  createSuperAdmin: async () => {
    try {
      // Step 1: Check if superadmin role exists, if not create it
      let roleId: string;
      const { data: roleData, error: roleError } = await supabase
        .from('roles')
        .select('id')
        .eq('name', 'superadmin')
        .single();

      if (roleError) {
        // Create the superadmin role
        const { data: newRole, error: createRoleError } = await supabase
          .from('roles')
          .insert([
            { 
              name: 'superadmin', 
              description: 'Super Administrator with full access',
              permissions: ['*'] 
            }
          ])
          .select('id')
          .single();
          
        if (createRoleError) throw createRoleError;
        roleId = newRole.id;
      } else {
        roleId = roleData.id;
      }

      // Step 2: Check if superadmin user already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('email', 'superadmin@edu.az')
        .single();

      if (!checkError && existingUser) {
        console.log('Superadmin user already exists');
        
        // Step 3a: Try to update the password if user exists
        const { error: authUpdateError } = await supabase.auth.admin.updateUserById(
          existingUser.id,
          {
            password: 'Admin123!',
            email_confirm: true
          }
        );
        
        if (authUpdateError) {
          console.log('Unable to update auth user:', authUpdateError);
          // If we can't update, try to recreate the auth user
          const { data, error } = await supabase.auth.signUp({
            email: 'superadmin@edu.az',
            password: 'Admin123!',
            options: {
              data: {
                first_name: 'Super',
                last_name: 'Admin'
              }
            }
          });
          
          if (error && error.message !== 'User already registered') throw error;
        }
        
        return { 
          success: true, 
          message: 'Superadmin user exists. You can log in with superadmin@edu.az / Admin123!' 
        };
      }

      // Step 3b: If not exists, create the auth account
      console.log('Creating new superadmin user...');
      const { data, error } = await supabase.auth.signUp({
        email: 'superadmin@edu.az',
        password: 'Admin123!',
        options: {
          data: {
            first_name: 'Super',
            last_name: 'Admin'
          }
        }
      });

      if (error) throw error;
      
      if (!data.user?.id) {
        return { 
          success: false, 
          message: 'Failed to get user ID from sign up response' 
        };
      }

      // Step 4: Insert the user record with all required fields
      const { error: userError } = await supabase
        .from('users')
        .insert([
          { 
            id: data.user.id,
            email: 'superadmin@edu.az',
            first_name: 'Super',
            last_name: 'Admin',
            role_id: roleId,
            is_active: true
          }
        ]);
      
      if (userError) throw userError;
      
      // Step 5: Try to auto-confirm the email 
      try {
        const { error: confirmError } = await supabase.auth.admin.updateUserById(
          data.user.id,
          { email_confirm: true }
        );
        
        if (confirmError) {
          console.log('Could not auto-confirm email:', confirmError);
          return { 
            success: true, 
            message: 'Superadmin created! Check your email to verify the account before logging in with superadmin@edu.az / Admin123!' 
          };
        }
      } catch (confirmError) {
        console.log('Could not access admin API, user may need email confirmation');
        return { 
          success: true, 
          message: 'Superadmin created! Check your email to verify the account before logging in with superadmin@edu.az / Admin123!' 
        };
      }
      
      return { 
        success: true, 
        message: 'Superadmin created successfully! You can now log in with superadmin@edu.az / Admin123!' 
      };
    } catch (error) {
      console.error('Failed to create superadmin:', error);
      return { 
        success: false, 
        message: 'Failed to create superadmin: ' + (error instanceof Error ? error.message : 'Unknown error'), 
        error 
      };
    }
  }
};

export default authService;
