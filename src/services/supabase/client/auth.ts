
import { supabase } from '../client';
import { User } from '../client';
import { toast } from 'sonner';

// Function to get the current authenticated user ID
export const getCurrentUserId = async (): Promise<string | null> => {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.user?.id || null;
  } catch (error) {
    console.error('Error getting current user ID:', error);
    return null;
  }
};

// Function to get the current authenticated user with extended information from users table
export const getCurrentUserWithProfile = async () => {
  try {
    const { data: authData } = await supabase.auth.getUser();
    
    if (!authData.user) {
      return { user: null };
    }

    // Get user data from users table 
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
      .eq('id', authData.user.id)
      .maybeSingle();
      
    if (userError) {
      console.error('Error fetching user data:', userError);
      toast('İstifadəçi məlumatları yüklənərkən xəta baş verdi');
      return { user: null, error: userError };
    }
      
    return { 
      user: {
        ...authData.user,
        ...userData
      }
    };
  } catch (error) {
    console.error('Error fetching current user:', error);
    return { user: null, error };
  }
};

// Function to synchronize user metadata with the users table
export const syncUserMetadata = async (
  userId: string, 
  metadata: { 
    first_name?: string; 
    last_name?: string; 
    role_id?: string;
    [key: string]: any;
  }
): Promise<boolean> => {
  try {
    // Update auth metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: metadata
    });
    
    if (updateError) {
      console.error('Error updating user metadata:', updateError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error synchronizing user metadata:', error);
    return false;
  }
};

// Function to check if a session exists
export const checkSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error checking session:', error);
      return { session: null, error };
    }
    
    return { session: data.session, error: null };
  } catch (error) {
    console.error('Error in checkSession:', error);
    return { session: null, error };
  }
};

// Function to manually set auth header for RLS requirements
export const setAuthHeader = async () => {
  try {
    const { data } = await supabase.auth.getSession();
    if (data?.session?.access_token) {
      localStorage.setItem('supabase_access_token', data.session.access_token);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error setting auth header:', error);
    return false;
  }
};

// Helper to extract role info from user data - safely handling both array and object formats
export const extractUserRole = (userData: any): string => {
  if (!userData) return 'school-admin'; // Default role if no user data
  
  // If roles is an array, get the first element's name
  if (userData.roles) {
    if (Array.isArray(userData.roles) && userData.roles.length > 0) {
      const roleName = userData.roles[0].name;
      return typeof roleName === 'string' ? roleName : 'school-admin';
    } else if (typeof userData.roles === 'object' && 'name' in userData.roles) {
      const roleName = userData.roles.name;
      return typeof roleName === 'string' ? roleName : 'school-admin';
    }
  }
  
  // If user has a direct role property
  if (userData.role) {
    return typeof userData.role === 'string' ? userData.role : 'school-admin';
  }
  
  return 'school-admin'; // Default role
};

// Function to get permissions based on role
export const getRolePermissions = async (roleId: string) => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('permissions')
      .eq('id', roleId)
      .single();

    if (error) {
      console.error('Error fetching role permissions:', error);
      return [];
    }

    return data?.permissions || [];
  } catch (error) {
    console.error('Error in getRolePermissions:', error);
    return [];
  }
};
