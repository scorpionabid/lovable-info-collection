
import { useState, useCallback } from 'react';
import { UserRole } from '../types/authTypes';

export type { UserRole };

export const useUserData = () => {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [authInitialized, setAuthInitialized] = useState<boolean>(false);
  const [sessionExists, setSessionExists] = useState<boolean>(false);

  const handleUserLoggedIn = useCallback((userData: any) => {
    const role = mapUserRoleFromAPI(userData.role || userData.userRole);
    
    setUser(userData);
    setUserRole(role);
    setLoading(false);
    setError(null);
    setSessionExists(true);
  }, []);

  const handleUserLoggedOut = useCallback(() => {
    setUser(null);
    setUserRole(null);
    setLoading(false);
    setSessionExists(false);
    console.log('User logged out');
  }, []);

  // Helper to map from API role string to UserRole type
  const mapUserRoleFromAPI = (role: string): UserRole => {
    switch (role) {
      case 'super-admin':
      case 'superadmin':
        return 'super-admin';
      case 'region-admin':
      case 'regionadmin':
        return 'region-admin';
      case 'sector-admin':
      case 'sectoradmin':
        return 'sector-admin';
      case 'school-admin':
      case 'schooladmin':
        return 'school-admin';
      case 'teacher':
        return 'teacher';
      default:
        console.warn(`Unknown role type: ${role}, defaulting to school-admin`);
        return 'school-admin';
    }
  };

  return {
    user,
    userRole,
    loading,
    error,
    setLoading,
    authInitialized,
    setAuthInitialized,
    handleUserLoggedIn,
    handleUserLoggedOut,
    sessionExists
  };
};
