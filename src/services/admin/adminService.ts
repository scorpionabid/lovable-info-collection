
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/services/api/userService';
import { toast } from "sonner";

/**
 * Fetches available admins (users with admin role who aren't assigned to a school yet)
 * @param schoolId The ID of the school
 * @returns Array of available admins
 */
export const fetchAvailableAdmins = async (schoolId?: string): Promise<User[]> => {
  if (!schoolId) return [];
  
  try {
    // First, get the role ID for school-admin
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'school-admin')
      .single();
    
    if (roleError || !roleData) {
      console.error('Error fetching school-admin role:', roleError);
      toast.error('Admin rolu tapılmadı');
      return [];
    }
    
    const roleId = roleData.id;
    
    // Then get users with that role who aren't assigned to any school yet
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role_id', roleId)
      .is('school_id', null);
    
    if (error) {
      console.error('Error fetching available admins:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error loading available admins:', error);
    toast.error('Admin siyahısı yüklənərkən xəta baş verdi');
    return [];
  }
};

/**
 * Assigns an existing admin to a school
 * @param schoolId The ID of the school
 * @param userId The ID of the user to assign
 * @returns Boolean indicating success
 */
export const assignAdminToSchool = async (schoolId: string, userId: string): Promise<boolean> => {
  try {
    // Check if school already has an admin
    const { data: existingAdmin } = await supabase
      .from('users')
      .select('id')
      .eq('school_id', schoolId)
      .eq('roles.name', 'school-admin')
      .single();
    
    // If there's an existing admin, unassign them first
    if (existingAdmin) {
      const { error: unassignError } = await supabase
        .from('users')
        .update({ school_id: null })
        .eq('id', existingAdmin.id);
      
      if (unassignError) {
        console.error('Error unassigning previous admin:', unassignError);
        // Continue with the assignment, but log the error
      }
    }
    
    // Update the user record to assign them to this school
    const { error } = await supabase
      .from('users')
      .update({ school_id: schoolId })
      .eq('id', userId);
    
    if (error) throw error;
    
    toast.success('Admin məktəbə uğurla təyin edildi');
    return true;
  } catch (error) {
    console.error('Error assigning admin:', error);
    toast.error('Admin təyin edilərkən xəta baş verdi');
    return false;
  }
};

export interface NewAdminForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
}

/**
 * Creates a new admin user and assigns them to a school
 * @param schoolId The ID of the school
 * @param adminData The new admin's data
 * @returns Boolean indicating success
 */
export const createNewAdmin = async (schoolId: string, adminData: NewAdminForm): Promise<boolean> => {
  try {
    // 1. Get role ID for school-admin
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'school-admin')
      .single();
    
    if (roleError || !roleData) {
      throw new Error('School admin role not found');
    }
    
    const roleId = roleData.id;

    // 2. Check if user already exists in auth system by email
    // We can't use getUserByEmail directly, so we'll check users table first
    const { data: existingUserData } = await supabase
      .from('users')
      .select('id')
      .eq('email', adminData.email)
      .maybeSingle();
    
    let userId = existingUserData?.id;
    
    if (!userId) {
      // No existing user found in our database, create a new one
      // First create auth user
      const authResult = await supabase.auth.signUp({
        email: adminData.email,
        password: adminData.password || '',
        options: {
          data: {
            first_name: adminData.firstName,
            last_name: adminData.lastName
          }
        }
      });
      
      if (authResult.error) {
        throw authResult.error;
      }
      
      if (!authResult.data?.user) {
        throw new Error('İstifadəçi yaradıla bilmədi');
      }
      
      userId = authResult.data.user.id;
    }
    
    // 3. Check if school already has an admin
    const { data: existingAdmin } = await supabase
      .from('users')
      .select('id')
      .eq('school_id', schoolId)
      .eq('roles.name', 'school-admin')
      .maybeSingle();
    
    // If there's an existing admin, unassign them first
    if (existingAdmin) {
      const { error: unassignError } = await supabase
        .from('users')
        .update({ school_id: null })
        .eq('id', existingAdmin.id);
      
      if (unassignError) {
        console.error('Error unassigning previous admin:', unassignError);
        // Continue with the assignment, but log the error
      }
    }
    
    // 4. Insert or update user data in users table with school_id
    const { error: insertError } = await supabase
      .from('users')
      .upsert({
        id: userId,
        first_name: adminData.firstName,
        last_name: adminData.lastName,
        email: adminData.email,
        phone: adminData.phone,
        role_id: roleId,
        school_id: schoolId,
        is_active: true
      }, {
        onConflict: 'id'
      });
    
    if (insertError) throw insertError;
    
    return true;
  } catch (error: any) {
    console.error('Error creating admin:', error);
    toast.error(`Admin yaradılarkən xəta baş verdi: ${error.message || 'Naməlum xəta'}`);
    return false;
  }
};
