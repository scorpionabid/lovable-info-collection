
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { fetchSchoolAdminRoleId } from './adminFetchUtils';
import { User as SupabaseAuthUser } from '@supabase/supabase-js';

/**
 * Assign an existing admin to a school
 */
export const assignAdminToSchool = async (schoolId: string, userId: string): Promise<boolean> => {
  try {
    // Double check that the user exists and has the school-admin role
    const roleId = await fetchSchoolAdminRoleId();
    if (!roleId) {
      toast.error('Admin rolu tapılmadı');
      return false;
    }
    
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, role_id')
      .eq('id', userId)
      .single();
      
    if (userError || !userData) {
      console.error('Error checking user:', userError);
      toast.error('İstifadəçi tapılmadı');
      return false;
    }
    
    if (userData.role_id !== roleId) {
      console.error('User is not a school admin');
      toast.error('İstifadəçi məktəb admini deyil');
      return false;
    }
    
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
    // First try to find the user by email in the database
    const { data: existingDBUser, error: dbError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingDBUser) {
      console.log('User already exists in database, using existing ID:', existingDBUser.id);
      return { userId: existingDBUser.id };
    }
      
    // Check if the user already exists in auth
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
    
    if (authError) {
      // Special case for "User already registered"
      if (authError.message.includes('already registered')) {
        // Try to sign in to get the user ID
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) {
          console.error('Error signing in existing user:', signInError);
          return { error: 'İstifadəçi mövcuddur, lakin şifrə səhvdir' };
        }
        
        if (signInData?.user?.id) {
          return { userId: signInData.user.id };
        }
        
        // If we can't sign in, try fetching the user from auth.users directly via admin API
        try {
          const { data: usersList, error: listError } = await supabase.auth.admin.listUsers();
          
          if (listError) {
            console.error('Error listing users:', listError);
            return { error: `İstifadəçilər siyahısı alınarkən xəta: ${listError.message}` };
          }
          
          // Explicitly type user as SupabaseAuthUser for the filter operation
          const authUser = usersList?.users?.find((user: SupabaseAuthUser) => {
            return user.email === email;
          });
          
          if (authUser?.id) {
            return { userId: authUser.id };
          }
        } catch (adminError) {
          console.error('Admin API error:', adminError);
        }
        
        return { error: 'İstifadəçi mövcuddur, lakin bazada tapılmadı' };
      }
      
      console.error('Error creating auth user:', authError);
      return { error: `Autentifikasiya xətası: ${authError.message}` };
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
      toast.error('Admin rolu tapılmadı');
      return false;
    }
    
    // Check if user already exists in database
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
      
    // If user exists, just update the school_id
    if (existingUser) {
      const { error: updateError } = await supabase
        .from('users')
        .update({
          school_id: schoolId,
          role_id: roleId,
          is_active: true
        })
        .eq('id', userId);
        
      if (updateError) {
        console.error('Error updating existing user:', updateError);
        toast.error(`Verilənlər bazası xətası: ${updateError.message}`);
        return false;
      }
      
      return true;
    }
    
    // Create new user record if it doesn't exist
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
