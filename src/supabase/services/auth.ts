
import { supabase } from '../client';
import type { LoginCredentials } from '@/hooks/types/authTypes';
import { UserRoleClaims, User } from '../types';

export type { LoginCredentials };

/**
 * Logs in a user with email and password
 */
export const loginUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Logs out the current user
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
 * Gets the current user session
 */
export const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
};

/**
 * Gets the current authenticated user
 */
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    
    return data.user;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
};

/**
 * Sends a password reset email
 */
export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};

/**
 * Updates the user's password
 */
export const updatePassword = async (newPassword: string) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Update password error:', error);
    throw error;
  }
};

/**
 * Refreshes the session
 */
export const refreshSession = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return data.session;
  } catch (error) {
    console.error('Refresh session error:', error);
    return null;
  }
};

/**
 * Checks if a user has a specific role
 */
export const hasRole = (user: User, role: string): boolean => {
  if (!user) return false;
  
  // Check user object for role information
  const userRole = user.role || user.userRole;
  if (userRole && typeof userRole === 'string') {
    return userRole === role;
  }
  
  // If user has custom claims
  const customClaims = (user as UserRoleClaims).app_metadata?.claims;
  if (customClaims?.roles) {
    return Array.isArray(customClaims.roles)
      ? customClaims.roles.includes(role)
      : customClaims.roles === role;
  }
  
  return false;
};

/**
 * Sends a confirmation email
 */
export const sendConfirmationEmail = async (email: string) => {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Send confirmation email error:', error);
    throw error;
  }
};

/**
 * Send password reset email for admin user
 */
export const sendPasswordResetEmail = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Send password reset email error:', error);
    throw error;
  }
};
