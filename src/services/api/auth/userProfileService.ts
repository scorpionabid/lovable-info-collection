
import { supabase } from '../../supabase/supabaseClient';

interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
}

interface UserData {
  id: string;
  email: string;
  roles: Role | Role[];
}

const userProfileService = {
  getCurrentUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      if (!user) return null;
      
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
        .eq('email', user.email)
        .single();
      
      if (userError) {
        console.error('User profile fetch error:', userError);
        return null;
      }
      
      return userData;
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
      
      // Get user's role and permissions with proper join
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          roles(
            permissions
          )
        `)
        .eq('email', user.email)
        .single();
      
      if (userError) {
        console.error('User permissions fetch error:', userError);
        return [];
      }
      
      // Return permissions if they exist
      if (userData?.roles) {
        // Handle both array and single object scenarios
        if (Array.isArray(userData.roles)) {
          // For array of roles
          if (userData.roles.length > 0) {
            const firstRole = userData.roles[0] as Role;
            return Array.isArray(firstRole.permissions) ? firstRole.permissions : [];
          }
        } else {
          // For single role object
          const singleRole = userData.roles as Role;
          return Array.isArray(singleRole.permissions) ? singleRole.permissions : [];
        }
      }
      
      return [];
    } catch (error) {
      console.error('Get user permissions error:', error);
      return [];
    }
  },
};

export default userProfileService;
