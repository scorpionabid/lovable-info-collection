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
  
  register: async (credentials: RegisterCredentials) => {
    try {
      // First register the user with Supabase Auth
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
      
      // Then create a record in our users table
      const { error: userError } = await supabase
        .from('users')
        .insert([
          { 
            email: credentials.email,
            first_name: credentials.firstName,
            last_name: credentials.lastName,
            role_id: credentials.role || 'user', // Default to user role if not specified
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
  },

  createSuperAdmin: async () => {
    try {
      // Check if superadmin already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('email', 'superadmin@edu.az')
        .single();

      if (!checkError && existingUser) {
        console.log('Superadmin already exists');
        return { success: true, message: 'Superadmin already exists' };
      }

      // Create the user in Auth
      const { data, error } = await supabase.auth.admin.createUser({
        email: 'superadmin@edu.az',
        password: 'Admin123!',
        email_confirm: true,
      });

      if (error) throw error;

      // Get or create superadmin role
      let roleId;
      const { data: roleData, error: roleError } = await supabase
        .from('roles')
        .select('id')
        .eq('name', 'superadmin')
        .single();

      if (roleError) {
        // Create the role if it doesn't exist
        const { data: newRole, error: createRoleError } = await supabase
          .from('roles')
          .insert([
            { 
              name: 'superadmin', 
              description: 'Super Administrator with full access',
              permissions: ['*'] // All permissions
            }
          ])
          .select('id')
          .single();
          
        if (createRoleError) throw createRoleError;
        roleId = newRole.id;
      } else {
        roleId = roleData.id;
      }

      // Create user profile
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
      
      return { success: true, message: 'Superadmin created successfully' };
    } catch (error) {
      console.error('Failed to create superadmin:', error);
      return { success: false, message: 'Failed to create superadmin', error };
    }
  }
};

export default authService;
