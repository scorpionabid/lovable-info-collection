
import { supabase } from "../client";
import { User, LoginCredentials } from "../types";
import { toast } from "sonner";

// Function to handle Supabase errors
const handleSupabaseError = (error: any, context: string = 'Authentication'): Error => {
  const message = error?.message || error?.error_description || 'Unknown error';
  console.error(`${context} error:`, error);
  return new Error(message);
};

export const loginUser = async (credentials: LoginCredentials) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw handleSupabaseError(error, 'Login');

    // Get the user profile after successful login
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select(`
        *,
        roles:role_id (id, name, permissions),
        region:region_id (id, name),
        sector:sector_id (id, name),
        school:school_id (id, name)
      `)
      .eq('id', data.user?.id)
      .single();

    if (userError) throw handleSupabaseError(userError, 'User data');

    // Update last login timestamp
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.user?.id);

    return {
      user: userData as User,
      session: data.session,
    };
  } catch (error) {
    throw handleSupabaseError(error, 'Login');
  }
};

export const logoutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw handleSupabaseError(error, 'Logout');
    return true;
  } catch (error) {
    throw handleSupabaseError(error, 'Logout');
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw handleSupabaseError(sessionError, 'Get session');
    
    if (!sessionData.session) return null;

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select(`
        *,
        roles:role_id (id, name, permissions),
        region:region_id (id, name),
        sector:sector_id (id, name),
        school:school_id (id, name)
      `)
      .eq('id', sessionData.session.user.id)
      .single();

    if (userError) throw handleSupabaseError(userError, 'Current user');

    return userData as User;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const registerUser = async (userData: any) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          first_name: userData.first_name,
          last_name: userData.last_name,
          role_id: userData.role_id
        }
      }
    });

    if (error) throw handleSupabaseError(error, 'Registration');

    return data;
  } catch (error) {
    throw handleSupabaseError(error, 'Registration');
  }
};

export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) throw handleSupabaseError(error, 'Password reset');

    return true;
  } catch (error) {
    throw handleSupabaseError(error, 'Password reset');
  }
};

export const updatePassword = async (password: string) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password
    });

    if (error) throw handleSupabaseError(error, 'Update password');

    return true;
  } catch (error) {
    throw handleSupabaseError(error, 'Update password');
  }
};

export const refreshSession = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) throw handleSupabaseError(error, 'Refresh session');
    return data;
  } catch (error) {
    throw handleSupabaseError(error, 'Refresh session');
  }
};
