
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../client';
import * as authService from '../services/auth';
import { LoginCredentials, User } from '../types';

// Define user role types
export type UserRole = 'super-admin' | 'region-admin' | 'sector-admin' | 'school-admin' | 'user';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [sessionExists, setSessionExists] = useState(false);

  // Function to check if the session exists
  const checkSession = useCallback(async () => {
    try {
      const { session, error } = await authService.getSession();
      if (error) throw error;
      
      setSessionExists(!!session);
      return !!session;
    } catch (error) {
      console.error('Session check error:', error);
      setSessionExists(false);
      return false;
    }
  }, []);

  // Login function
  const login = useCallback(async (email: string | LoginCredentials, password?: string) => {
    setLoading(true);
    try {
      let credentials: LoginCredentials;
      
      if (typeof email === 'string' && password) {
        credentials = { email, password };
      } else if (typeof email === 'object') {
        credentials = email;
      } else {
        throw new Error('Invalid login credentials');
      }
      
      const { user, session, error } = await authService.loginUser(credentials);
      
      if (error) throw error;
      
      setUser(user);
      setUserRole((user.roles?.name || 'user') as UserRole);
      setSessionExists(true);
      
      return { user, session };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      const success = await authService.logoutUser();
      if (success) {
        setUser(null);
        setUserRole('user');
        setSessionExists(false);
      }
      return success;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Password reset function
  const resetPassword = useCallback(async (email: string) => {
    try {
      const success = await authService.resetPassword(email);
      return success;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }, []);

  // Update password function
  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      const success = await authService.updatePassword(newPassword);
      return success;
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  }, []);

  // Check user's role
  const hasRole = useCallback((requiredRole: UserRole): boolean => {
    if (!userRole) return false;
    
    // Define role hierarchy
    const roleHierarchy: Record<UserRole, number> = {
      'super-admin': 4,
      'region-admin': 3,
      'sector-admin': 2,
      'school-admin': 1,
      'user': 0
    };
    
    // Check if user has sufficient permissions
    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }, [userRole]);

  // Initialize auth state on component mount
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          setUser(user);
          setUserRole((user.roles?.name || 'user') as UserRole);
          setSessionExists(true);
        } else {
          setUser(null);
          setUserRole('user');
          setSessionExists(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
        setUserRole('user');
        setSessionExists(false);
      } finally {
        setLoading(false);
        setAuthInitialized(true);
      }
    };

    initAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const user = await authService.getCurrentUser();
          setUser(user);
          setUserRole((user?.roles?.name || 'user') as UserRole);
          setSessionExists(true);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserRole('user');
          setSessionExists(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    userRole,
    loading,
    isLoading: loading,
    isAuthenticated: !!user,
    login,
    logout,
    resetPassword,
    updatePassword,
    hasRole,
    sessionExists,
    authInitialized
  };
}

export default useAuth;
