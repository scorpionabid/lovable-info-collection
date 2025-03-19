
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { type User } from '@/services/userService/types';
import { toast } from 'sonner';

export const fetchSchoolAdminRoleId = async (): Promise<string | null> => {
  try {
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'school-admin')
      .single();
      
    if (roleError) {
      console.error('Error getting school-admin role:', roleError);
      return null;
    }
    
    return roleData?.id || null;
  } catch (error) {
    console.error('Error fetching school admin role ID:', error);
    return null;
  }
};

export const useAdminFetching = (schoolId?: string) => {
  const [isLoading, setIsLoading] = useState(false);

  const loadAdminData = useCallback(async () => {
    if (!schoolId) {
      return { users: [], currentAdmin: null };
    }

    setIsLoading(true);
    try {
      // Get the role ID for SchoolAdmin
      const schoolAdminRoleId = await fetchSchoolAdminRoleId();
      
      if (!schoolAdminRoleId) {
        console.error('School admin role ID not found');
        toast.error('Admin rolu tapılmadı');
        return { users: [], currentAdmin: null };
      }
      
      // Get the current admin for this school
      const { data: currentAdminData, error: currentAdminError } = await supabase
        .from('users')
        .select('*')
        .eq('school_id', schoolId)
        .eq('role_id', schoolAdminRoleId)
        .eq('is_active', true)
        .maybeSingle();
        
      if (currentAdminError) {
        console.error('Error fetching current admin:', currentAdminError);
      }
      
      // Get all users with the school-admin role that are not assigned to a school
      const { data: availableAdmins, error: availableAdminsError } = await supabase
        .from('users')
        .select('*')
        .eq('role_id', schoolAdminRoleId)
        .eq('is_active', true)
        .is('school_id', null);
        
      if (availableAdminsError) {
        console.error('Error fetching available admins:', availableAdminsError);
        toast.error('Admin siyahısı yüklənmədi');
        return { 
          users: [], 
          currentAdmin: currentAdminData as User | null 
        };
      }
      
      return { 
        users: availableAdmins as User[],
        currentAdmin: currentAdminData as User | null
      };
    } catch (error) {
      console.error('Error in loadAdminData:', error);
      toast.error('Admin məlumatları yüklənərkən xəta baş verdi');
      return { users: [], currentAdmin: null };
    } finally {
      setIsLoading(false);
    }
  }, [schoolId]);

  return { loadAdminData, isLoading };
};
