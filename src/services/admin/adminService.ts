
import { supabase } from '@/supabase/client';

export interface NewAdminForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export const createSchoolAdmin = async (schoolId: string, adminData: NewAdminForm) => {
  try {
    // First, create the user in Auth
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
    
    if (authError) throw authError;
    
    if (!authData.user) {
      throw new Error('Failed to create user account');
    }
    
    // Get school admin role ID
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'school-admin')
      .single();
      
    if (roleError) throw roleError;
    
    // Create profile record in users table
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        first_name: adminData.firstName,
        last_name: adminData.lastName,
        email: adminData.email,
        phone: adminData.phone || null,
        role_id: roleData.id,
        school_id: schoolId,
        is_active: true
      });
      
    if (profileError) throw profileError;
    
    return {
      success: true,
      userId: authData.user.id
    };
  } catch (error) {
    console.error('Error creating school admin:', error);
    throw error;
  }
};

export const assignAdminToSchool = async (schoolId: string, userId: string) => {
  try {
    // Get school admin role ID
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'school-admin')
      .single();
      
    if (roleError) throw roleError;
    
    // Update user record
    const { error: updateError } = await supabase
      .from('users')
      .update({
        school_id: schoolId,
        role_id: roleData.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
      
    if (updateError) throw updateError;
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error assigning admin to school:', error);
    throw error;
  }
};

export const getAvailableAdmins = async () => {
  try {
    // Get school admin role ID
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'school-admin')
      .single();
      
    if (roleError) throw roleError;
    
    // Get users with school admin role who are not assigned to a school
    const { data: admins, error: adminsError } = await supabase
      .from('users')
      .select('id, first_name, last_name, email, phone')
      .eq('role_id', roleData.id)
      .is('school_id', null)
      .order('last_name');
      
    if (adminsError) throw adminsError;
    
    return admins || [];
  } catch (error) {
    console.error('Error getting available admins:', error);
    return [];
  }
};

export const getSchoolAdmin = async (schoolId: string) => {
  try {
    // Get school admin role ID
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'school-admin')
      .single();
      
    if (roleError) throw roleError;
    
    // Get admin assigned to this school
    const { data, error } = await supabase
      .from('users')
      .select('id, first_name, last_name, email, phone')
      .eq('role_id', roleData.id)
      .eq('school_id', schoolId)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned, no admin assigned
        return null;
      }
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error getting school admin:', error);
    return null;
  }
};
