
import { toast } from 'sonner';
import { supabase } from '@/supabase/client';  // Updated import path

// Interface for admin creation
interface AdminCreationParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  schoolId: string;
  phone?: string;
}

// Create a new admin user
export const createSchoolAdmin = async (params: AdminCreationParams) => {
  try {
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: params.email,
      password: params.password,
      options: {
        data: {
          first_name: params.firstName,
          last_name: params.lastName
        }
      }
    });

    if (authError) {
      console.error('Auth creation error:', authError);
      throw new Error(`Auth error: ${authError.message}`);
    }

    if (!authData.user) {
      throw new Error('Failed to create user authentication');
    }

    // Get the admin role id
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'SchoolAdmin')
      .single();

    if (roleError || !roleData) {
      console.error('Role fetch error:', roleError);
      throw new Error('Could not find SchoolAdmin role');
    }

    // 2. Create user record in the database
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: params.email,
        first_name: params.firstName,
        last_name: params.lastName,
        phone: params.phone || null,
        role_id: roleData.id,
        school_id: params.schoolId,
        is_active: true
      });

    if (userError) {
      console.error('User creation error:', userError);
      throw new Error(`User record error: ${userError.message}`);
    }

    // Send a welcome message to the user's notification inbox
    await supabase
      .from('notifications')
      .insert({
        user_id: authData.user.id,
        title: 'Welcome to InfoLine',
        message: `Your admin account for the school has been created. You can now login and start managing your school's data.`,
        type: 'info'
      });

    return { success: true, userId: authData.user.id };
  } catch (error) {
    console.error('Admin creation failed:', error);
    toast.error(`Admin yaradılarkən xəta: ${(error as Error).message}`);
    return { success: false, error: (error as Error).message };
  }
};

// Assign existing user as school admin
export const assignUserAsSchoolAdmin = async (userId: string, schoolId: string) => {
  try {
    // Get the SchoolAdmin role ID
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'SchoolAdmin')
      .single();

    if (roleError || !roleData) {
      throw new Error('Could not find SchoolAdmin role');
    }

    // Update the user's role and school
    const { error: updateError } = await supabase
      .from('users')
      .update({
        role_id: roleData.id,
        school_id: schoolId,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      throw new Error(`User update error: ${updateError.message}`);
    }

    // Notify the user about their new role
    await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title: 'Role Assignment',
        message: 'You have been assigned as a school administrator.',
        type: 'info'
      });

    return { success: true };
  } catch (error) {
    console.error('Admin assignment failed:', error);
    toast.error(`Admin təyin edilərkən xəta: ${(error as Error).message}`);
    return { success: false, error: (error as Error).message };
  }
};

// Get admin for school
export const getSchoolAdmin = async (schoolId: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select(`
        id, first_name, last_name, email, phone, is_active, created_at, last_login,
        roles:role_id (id, name)
      `)
      .eq('school_id', schoolId)
      .eq('roles.name', 'SchoolAdmin')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Fetching school admin failed:', error);
    return null;
  }
};

// Revoke school admin role
export const revokeSchoolAdmin = async (userId: string) => {
  try {
    // Get the default user role ID
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'User')
      .single();

    if (roleError || !roleData) {
      // Fallback to find any non-admin role
      const { data: fallbackRole, error: fallbackError } = await supabase
        .from('roles')
        .select('id')
        .not('name', 'eq', 'SchoolAdmin')
        .limit(1)
        .single();

      if (fallbackError || !fallbackRole) {
        throw new Error('Could not find appropriate role to downgrade to');
      }

      roleData.id = fallbackRole.id;
    }

    // Update the user's role and remove school assignment
    const { error: updateError } = await supabase
      .from('users')
      .update({
        role_id: roleData.id,
        school_id: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      throw new Error(`User update error: ${updateError.message}`);
    }

    // Notify the user about their role change
    await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title: 'Role Change',
        message: 'Your school administrator role has been revoked.',
        type: 'info'
      });

    return { success: true };
  } catch (error) {
    console.error('Admin revocation failed:', error);
    toast.error(`Admin rolu ləğv edilərkən xəta: ${(error as Error).message}`);
    return { success: false, error: (error as Error).message };
  }
};
