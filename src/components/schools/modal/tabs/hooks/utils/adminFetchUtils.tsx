
import { useState, useCallback } from 'react';
import { toast } from "sonner";
import { User } from '@/services/api/userService';
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch school admin role ID
 */
export const fetchSchoolAdminRoleId = async (): Promise<string | null> => {
  try {
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'school-admin')
      .single();
    
    if (roleError || !roleData) {
      console.error('School admin role not found:', roleError);
      toast.error('Admin rolu tapılmadı');
      return null;
    }
    
    return roleData.id;
  } catch (error) {
    console.error('Error fetching school admin role:', error);
    return null;
  }
};

/**
 * Fetch available admins (not assigned to any school)
 * This function has been improved to handle empty results correctly
 */
export const fetchAvailableAdmins = async (roleId: string): Promise<User[]> => {
  try {
    // Get the current user's auth data
    const authResponse = await supabase.auth.getUser();
    const currentUserId = authResponse.data.user?.id;
    
    if (!currentUserId) {
      console.error('No authenticated user found');
      return [];
    }
    
    // Get the current user's role to apply proper filtering
    const { data: currentUser, error: currentUserError } = await supabase
      .from('users')
      .select('*, roles(name)')
      .eq('id', currentUserId)
      .single();
    
    if (currentUserError) {
      console.error('Error fetching current user:', currentUserError);
      return [];
    }
    
    let query = supabase
      .from('users')
      .select('*')
      .eq('role_id', roleId)
      .is('school_id', null);
    
    // Apply role-based filtering to respect hierarchy
    const userRole = currentUser?.roles?.name;
    if (userRole === 'region-admin' && currentUser.region_id) {
      query = query.eq('region_id', currentUser.region_id);
    } else if (userRole === 'sector-admin' && currentUser.sector_id) {
      query = query.eq('sector_id', currentUser.sector_id);
    }
    
    const { data: availableAdmins, error: adminsError } = await query;
    
    if (adminsError) {
      console.error('Error fetching available admins:', adminsError);
      toast.error('Mövcud adminlər yüklənərkən xəta baş verdi');
      return [];
    }
    
    if (!availableAdmins || availableAdmins.length === 0) {
      // Return empty array but don't show error - this is a valid state
      console.log('No available admins found');
      return [];
    }
    
    return availableAdmins;
  } catch (error) {
    console.error('Error fetching available admins:', error);
    return [];
  }
};

/**
 * Fetch current school admin
 */
export const fetchCurrentSchoolAdmin = async (schoolId: string, roleId: string): Promise<User | null> => {
  try {
    const { data: schoolAdmin, error } = await supabase
      .from('users')
      .select('*')
      .eq('school_id', schoolId)
      .eq('role_id', roleId)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching current school admin:', error);
      return null;
    }
      
    return schoolAdmin as User | null;
  } catch (error) {
    console.error('Error fetching current school admin:', error);
    return null;
  }
};

/**
 * Hook with combined fetch operations
 */
export const useAdminFetching = (schoolId?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const loadAdminData = useCallback(async () => {
    if (!schoolId) return { users: [], currentAdmin: null };
    
    setIsLoading(true);
    try {
      // Get school-admin role ID
      const roleId = await fetchSchoolAdminRoleId();
      
      if (!roleId) {
        setIsLoading(false);
        return { users: [], currentAdmin: null };
      }
      
      // Get available admins
      const availableAdmins = await fetchAvailableAdmins(roleId);
      
      // Check if this school already has an admin
      const schoolAdmin = await fetchCurrentSchoolAdmin(schoolId, roleId);
      
      return { 
        users: availableAdmins, 
        currentAdmin: schoolAdmin 
      };
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast.error('Admin məlumatları yüklənərkən xəta baş verdi');
      return { users: [], currentAdmin: null };
    } finally {
      setIsLoading(false);
    }
  }, [schoolId]);
  
  return {
    loadAdminData,
    isLoading,
    setIsLoading
  };
};
