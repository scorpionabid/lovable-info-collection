
import { supabase } from '../client';
import { LoginCredentials, User } from '../types';

/**
 * Login user with email and password
 */
export const loginUser = async (credentials: LoginCredentials) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw error;

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

    if (userError) throw userError;

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
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Logout current user
 */
export const logoutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

/**
 * Get current user with profile data
 */
export const getCurrentUser = async () => {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    
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

    if (userError) throw userError;

    return userData as User;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Get current session
 */
export const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { session: data.session, error: null };
  } catch (error) {
    console.error('Get session error:', error);
    return { session: null, error };
  }
};

/**
 * Register new user
 */
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

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

/**
 * Update user password
 */
export const updatePassword = async (password: string) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password
    });

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Update password error:', error);
    throw error;
  }
};

/**
 * Refresh session
 */
export const refreshSession = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Refresh session error:', error);
    throw error;
  }
};
