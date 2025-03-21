
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';

// Assign existing admin to school
export const assignAdminToSchool = async (schoolId: string, userId: string): Promise<boolean> => {
  try {
    // Check if user has role of school-admin
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'school-admin')
      .single();
    
    if (roleError) {
      console.error('Error fetching school-admin role:', roleError);
      toast.error('Rol tapılmadı');
      return false;
    }
    
    // Update user's role and school_id
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        role_id: roleData.id,
        school_id: schoolId
      })
      .eq('id', userId);
    
    if (updateError) {
      console.error('Error updating user:', updateError);
      toast.error(updateError.message);
      return false;
    }
    
    toast.success('Admin məktəbə təyin edildi');
    return true;
  } catch (error) {
    console.error('Error assigning admin to school:', error);
    toast.error(`Xəta: ${(error as Error).message}`);
    return false;
  }
};

// Create admin auth user
export const createAdminAuthUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<{ userId: string | null; error: string | null }> => {
  try {
    // Create user in auth module
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName
        }
      }
    });
    
    if (error) {
      console.error('Error creating auth user:', error);
      return { userId: null, error: error.message };
    }
    
    if (!data.user) {
      return { userId: null, error: 'İstifadəçi yaradıla bilmədi' };
    }
    
    return { userId: data.user.id, error: null };
  } catch (error) {
    console.error('Error in auth user creation:', error);
    return { userId: null, error: (error as Error).message };
  }
};

// Create admin database record
export const createAdminDbRecord = async (
  userId: string,
  email: string,
  firstName: string,
  lastName: string,
  phone: string,
  schoolId: string
): Promise<boolean> => {
  try {
    // Get school-admin role id
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'school-admin')
      .single();
    
    if (roleError) {
      console.error('Error fetching school-admin role:', roleError);
      toast.error('School-admin rolu tapılmadı');
      return false;
    }
    
    // Create user record in database
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        id: userId,
        email: email,
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
        role_id: roleData.id,
        school_id: schoolId,
        is_active: true
      });
    
    if (userError) {
      console.error('Error creating user record:', userError);
      toast.error(userError.message);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in db record creation:', error);
    toast.error(`Xəta: ${(error as Error).message}`);
    return false;
  }
};
