import { supabase } from '@/integrations/supabase/client';

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
        .maybeSingle();
      
      if (userError) {
        console.error('User profile fetch error:', userError);
        return null;
      }
      
      if (!userData && user) {
        console.log('Auth user exists but no corresponding record in users table');
        return {
          id: user.id,
          email: user.email,
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          roles: null
        };
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
      
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          roles(
            permissions
          )
        `)
        .eq('email', user.email)
        .maybeSingle();
      
      if (userError) {
        console.error('User permissions fetch error:', userError);
        return [];
      }
      
      if (!userData) {
        console.warn('No user record found for permissions check');
        return [];
      }
      
      if (userData?.roles) {
        if (Array.isArray(userData.roles)) {
          if (userData.roles.length > 0) {
            const firstRole = userData.roles[0] as Role;
            return Array.isArray(firstRole.permissions) ? firstRole.permissions : [];
          }
        } else {
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
