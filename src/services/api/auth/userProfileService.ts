
import { supabase } from '../../supabase/supabaseClient';

const userProfileService = {
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
};

export default userProfileService;
