
import { supabase } from '@/supabase/client';

export interface NewAdminForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export const createSchoolAdmin = async (
  schoolId: string,
  adminData: NewAdminForm
) => {
  if (!schoolId || !adminData.email || !adminData.firstName || !adminData.lastName) {
    throw new Error('Məcburi sahələr daxil edilməyib');
  }
  
  try {
    // First, get the school-admin role ID
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'school-admin')
      .single();
      
    if (roleError) {
      throw new Error(`School admin rolu tapılmadı: ${roleError.message}`);
    }
    
    // Create auth user first
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: adminData.email,
      password: adminData.password,
      options: {
        data: {
          first_name: adminData.firstName,
          last_name: adminData.lastName,
          role_id: roleData.id
        }
      }
    });
    
    if (authError) {
      throw new Error(`İstifadəçi yaradılarkən xəta: ${authError.message}`);
    }
    
    if (!authData?.user?.id) {
      throw new Error('İstifadəçi yaradıldı, lakin ID alınmadı');
    }
    
    // Create user record in users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        first_name: adminData.firstName,
        last_name: adminData.lastName,
        email: adminData.email,
        phone: adminData.phone,
        role_id: roleData.id,
        school_id: schoolId,
        is_active: true
      })
      .select()
      .single();
      
    if (userError) {
      throw new Error(`İstifadəçi məlumatları əlavə edilərkən xəta: ${userError.message}`);
    }
    
    return {
      userId: authData.user.id,
      user: userData
    };
  } catch (error) {
    console.error('Error creating school admin:', error);
    throw error;
  }
};

export const assignSchoolAdmin = async (
  schoolId: string,
  userId: string
) => {
  if (!schoolId || !userId) {
    throw new Error('Məktəb ID və ya istifadəçi ID-si daxil edilməyib');
  }
  
  try {
    // Update user record in users table
    const { data, error } = await supabase
      .from('users')
      .update({
        school_id: schoolId
      })
      .eq('id', userId)
      .select()
      .single();
      
    if (error) {
      throw new Error(`Admin təyin edilərkən xəta: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error assigning school admin:', error);
    throw error;
  }
};

export const getCurrentSchoolAdmin = async (schoolId: string) => {
  if (!schoolId) {
    return null;
  }
  
  try {
    // Get the school-admin role ID
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'school-admin')
      .single();
      
    if (roleError) {
      throw new Error(`School admin rolu tapılmadı: ${roleError.message}`);
    }
    
    // Get the current admin for the school
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('school_id', schoolId)
      .eq('role_id', roleData.id)
      .single();
      
    if (error && error.code !== 'PGRST116') { // PGRST116 is not found
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error getting current school admin:', error);
    return null;
  }
};
