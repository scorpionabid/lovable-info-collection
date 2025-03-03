
import { supabase } from '../../supabase/supabaseClient';

const userProfileService = {
  getCurrentUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      if (!user) return null;
      
      // First fetch user data without joining roles
      const { data: userData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();
      
      if (profileError) throw profileError;
      
      // If role_id exists, fetch the role separately
      let roleData = null;
      if (userData && userData.role_id) {
        const { data: roleResult, error: roleError } = await supabase
          .from('roles')
          .select('*')
          .eq('id', userData.role_id)
          .maybeSingle();
          
        if (!roleError && roleResult) {
          roleData = roleResult;
        }
      }
      
      // Combine user and role data
      return {
        ...userData,
        roles: roleData
      };
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
      
      // Get the user's role_id first
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role_id')
        .eq('email', user.email)
        .single();
      
      if (userError) throw userError;
      
      if (!userData || !userData.role_id) return [];
      
      // Then fetch permissions from the roles table
      const { data: roleData, error: roleError } = await supabase
        .from('roles')
        .select('permissions')
        .eq('id', userData.role_id)
        .maybeSingle();
      
      if (roleError) throw roleError;
      
      // Return permissions if they exist
      if (roleData && roleData.permissions) {
        return Array.isArray(roleData.permissions) ? roleData.permissions : [];
      }
      
      return [];
    } catch (error) {
      console.error('Get user permissions error:', error);
      return [];
    }
  },
};

export default userProfileService;
