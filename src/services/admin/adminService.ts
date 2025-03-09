
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
    const { data: roleData } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'school-admin')
      .single();
    
    if (!roleData) {
      throw new Error('School admin role not found');
    }
    
    const roleId = roleData.id;
    
    // Get users with school-admin role who don't have a school assigned yet
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role_id', roleId)
      .is('school_id', null);
    
    if (error) throw error;
    
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
    
    if (roleError) throw roleError;
    
    const roleId = roleData.id;

    // 2. Check if user already exists in auth system
    const { data: existingUser } = await supabase.auth.admin.getUserByEmail(adminData.email);
    
    let userId;
    
    if (existingUser?.user) {
      // User already exists in auth
      userId = existingUser.user.id;
      console.log('User already exists in auth system, using existing ID:', userId);
    } else {
      // 3. Create user in auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: adminData.email,
        password: adminData.password || '',
        options: {
          data: {
            first_name: adminData.firstName,
            last_name: adminData.lastName
          }
        }
      });
      
      if (authError) throw authError;
      
      if (!authData.user) {
        throw new Error('İstifadəçi yaradıla bilmədi');
      }
      
      userId = authData.user.id;
    }
    
    // 4. Insert user data into users table with school_id using UPSERT
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
        onConflict: 'id',
        returning: 'minimal'
      });
    
    if (insertError) throw insertError;
    
    return true;
  } catch (error: any) {
    console.error('Error creating admin:', error);
    toast.error(`Admin yaradılarkən xəta baş verdi: ${error.message || 'Naməlum xəta'}`);
    return false;
  }
};
