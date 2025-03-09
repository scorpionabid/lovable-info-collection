
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { fetchSchoolAdminRoleId } from './adminFetchUtils';

/**
 * Assign an existing admin to a school
 */
export const assignAdminToSchool = async (schoolId: string, userId: string): Promise<boolean> => {
  try {
    // Update user record to associate with school
    const { error } = await supabase
      .from('users')
      .update({ school_id: schoolId })
      .eq('id', userId);
      
    if (error) {
      console.error('Error assigning admin to school:', error);
      toast.error('Admin təyin edilərkən xəta baş verdi');
      return false;
    }
    
    toast.success('Admin məktəbə uğurla təyin edildi');
    return true;
  } catch (error) {
    console.error('Error in admin assignment:', error);
    toast.error('Admin təyin edilərkən xəta baş verdi');
    return false;
  }
};

/**
 * Create a new admin user in auth
 */
export const createAdminAuthUser = async (
  email: string, 
  password: string,
  firstName: string,
  lastName: string
): Promise<{ userId?: string; error?: string }> => {
  try {
    // First create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName
        }
      }
    });
    
    if (authError && !authError.message.includes('already registered')) {
      console.error('Error creating auth user:', authError);
      return { error: `Autentifikasiya xətası: ${authError.message}` };
    }
    
    // If user already exists, try to find their ID
    if (authError?.message.includes('already registered')) {
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();
        
      if (userData?.id) {
        return { userId: userData.id };
      }
      
      return { error: 'İstifadəçi mövcuddur, lakin bazada tapılmadı' };
    }
    
    // Return the new user ID
    if (authData?.user?.id) {
      return { userId: authData.user.id };
    }
    
    return { error: 'İstifadəçi yaradıla bilmədi' };
  } catch (error) {
    console.error('Error in auth user creation:', error);
    return { error: `Auth xətası: ${(error as Error).message}` };
  }
};

/**
 * Create admin database record
 */
export const createAdminDbRecord = async (
  userId: string,
  email: string,
  firstName: string,
  lastName: string,
  phone: string | null,
  schoolId: string
): Promise<boolean> => {
  try {
    // Get school-admin role ID
    const roleId = await fetchSchoolAdminRoleId();
    
    if (!roleId) {
      return false;
    }
    
    // Create or update user record
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        id: userId,
        email,
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
        role_id: roleId,
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
    console.error('Error creating admin db record:', error);
    return false;
  }
};
