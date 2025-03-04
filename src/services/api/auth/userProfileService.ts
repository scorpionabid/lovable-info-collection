
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
  roles: Role;
}

const userProfileService = {
  getCurrentUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      if (!user) return null;
      
      // Get user profile with role
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          *,
          roles (
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
      
      // Get user's role and permissions
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          roles (
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
      if (userData?.roles && userData.roles.permissions) {
        return Array.isArray(userData.roles.permissions) ? userData.roles.permissions : [];
      }
      
      return [];
    } catch (error) {
      console.error('Get user permissions error:', error);
      return [];
    }
  },
};

export default userProfileService;
