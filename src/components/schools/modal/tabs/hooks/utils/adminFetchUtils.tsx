
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/supabase/client';
import { type User } from '@/services/userService/types';

export const useAdminFetching = (schoolId?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const loadAdminData = async () => {
    setIsLoading(true);
    let users: User[] = [];
    let currentAdmin: User | null = null;
    
    try {
      // Get school-admin role id
      const { data: roleData, error: roleError } = await supabase
        .from('roles')
        .select('id')
        .eq('name', 'school-admin')
        .single();
      
      if (roleError) {
        toast.error('School-admin rolu tapılmadı');
        return { users: [], currentAdmin: null };
      }
      
      // Get current admin of the school
      if (schoolId) {
        const { data: adminData, error: adminError } = await supabase
          .from('users')
          .select('id, first_name, last_name, email, phone, role_id, school_id, is_active')
          .eq('role_id', roleData.id)
          .eq('school_id', schoolId)
          .maybeSingle();
        
        if (adminError && adminError.code !== 'PGRST116') {
          console.error('Error fetching current admin:', adminError);
        } else if (adminData) {
          currentAdmin = adminData as User;
        }
      }
      
      // Get potential admin users (not assigned to any school yet)
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, first_name, last_name, email, phone, role_id, is_active')
        .is('school_id', null)
        .order('first_name');
      
      if (usersError) {
        console.error('Error fetching potential admin users:', usersError);
      } else if (usersData) {
        users = usersData as User[];
      }
      
      return { users, currentAdmin };
    } catch (error) {
      console.error('Error in loadAdminData:', error);
      toast.error(`Xəta: ${(error as Error).message}`);
      return { users: [], currentAdmin: null };
    } finally {
      setIsLoading(false);
    }
  };
  
  return { loadAdminData, isLoading };
};
