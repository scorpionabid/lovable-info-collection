
import { supabase } from '@/lib/supabase/client';
import type { User } from '@/services/userService/types';
import { toast } from "sonner";

// Define the interface here but don't export it directly
interface NewAdminForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

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
      toast.error('Mövcud adminlər yüklənərkən xəta baş verdi');
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchAvailableAdmins:', error);
    return [];
  }
};

/**
 * Assigns an existing admin to a school
 * @param schoolId The ID of the school
 * @param adminId The ID of the admin user
 * @returns Success status
 */
export const assignAdminToSchool = async (schoolId: string, adminId: string): Promise<boolean> => {
  try {
    // Update user record to associate with school
    const { error } = await supabase
      .from('users')
      .update({ school_id: schoolId })
      .eq('id', adminId);
      
    if (error) {
      console.error('Error assigning admin to school:', error);
      toast.error('Admin təyin edilərkən xəta baş verdi');
      return false;
    }
    
    toast.success('Admin məktəbə uğurla təyin edildi');
    return true;
  } catch (error) {
    console.error('Error in assignAdminToSchool:', error);
    toast.error('Admin təyin edilərkən xəta baş verdi');
    return false;
  }
};

/**
 * Creates a new admin user and assigns them to a school
 * @param schoolId The ID of the school
 * @param adminData The new admin's information
 * @returns Success status
 */
export const createNewAdmin = async (schoolId: string, adminData: NewAdminForm): Promise<boolean> => {
  try {
    // Input validation
    if (!schoolId || !adminData.email || !adminData.firstName || !adminData.lastName) {
      toast.error('Bütün məcburi sahələri doldurun');
      return false;
    }
    
    // Get school-admin role ID
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'school-admin')
      .single();
      
    if (roleError || !roleData) {
      console.error('School admin role not found:', roleError);
      toast.error('Admin rolu tapılmadı');
      return false;
    }
    
    // First create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: adminData.email,
      password: adminData.password,
      options: {
        data: {
          first_name: adminData.firstName,
          last_name: adminData.lastName
        }
      }
    });
    
    let userId: string;
    
    // Handle different auth scenarios
    if (authError) {
      if (authError.message.includes('already registered')) {
        // User already exists in auth, try to find their ID
        const { data: userData } = await supabase
          .from('users')
          .select('id')
          .eq('email', adminData.email)
          .maybeSingle();
          
        if (userData?.id) {
          userId = userData.id;
        } else {
          // Try to get auth user ID by alternative means
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: adminData.email,
            password: adminData.password
          }).catch(() => ({ data: null, error: new Error("Sign in failed") }));
          
          if (signInData?.user?.id) {
            userId = signInData.user.id;
          } else {
            toast.error('İstifadəçi mövcuddur, lakin bazada tapılmadı');
            return false;
          }
        }
      } else {
        console.error('Error creating auth user:', authError);
        toast.error(`Autentifikasiya xətası: ${authError.message}`);
        return false;
      }
    } else if (authData?.user?.id) {
      userId = authData.user.id;
    } else {
      toast.error('İstifadəçi yaradıla bilmədi');
      return false;
    }
    
    // Create or update user record with UPSERT to handle race conditions
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        id: userId,
        email: adminData.email,
        first_name: adminData.firstName,
        last_name: adminData.lastName,
        phone: adminData.phone || null,
        role_id: roleData.id,
        school_id: schoolId,
        is_active: true
      }, {
        onConflict: 'id'
      });
      
    if (userError) {
      console.error('Error creating user record:', userError);
      toast.error(`Verilənlər bazası xətası: ${userError.message}`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in createNewAdmin:', error);
    toast.error(`Admin yaradılarkən xəta baş verdi: ${(error as Error).message}`);
    return false;
  }
};

// Export the type separately to avoid conflict
export type { NewAdminForm };
