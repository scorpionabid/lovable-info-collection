
import { useAuthActions } from "./auth/useAuthActions";
import { useUserData } from "./auth/useUserData";
import { useAuthListener } from "./auth/useAuthListener";
import { UserRole, LoginCredentials } from "./types/authTypes";

export type { UserRole, LoginCredentials };

export const useAuthProvider = () => {
  // Setup user data state management
  const {
    user,
    userRole,
    loading,
    setLoading,
    authInitialized,
    setAuthInitialized,
    handleUserLoggedIn,
    handleUserLoggedOut
  } = useUserData();

  // Setup auth actions
  const { login, logout } = useAuthActions(handleUserLoggedIn, handleUserLoggedOut);

  // Setup auth listener
  useAuthListener(
    handleUserLoggedIn,
    handleUserLoggedOut,
    setLoading,
    setAuthInitialized,
    user
  );
  
  // Compute derived values
  const isAuthenticated = Boolean(user);
  
  // Only show as loading if we're still initializing auth AND loading user data
  const isLoading = loading && !authInitialized;

  // Handle permissions with fallback
  const permissions = user?.roles?.permissions || [];

  return { 
    user, 
    userRole, 
    loading, 
    isLoading, 
    isAuthenticated, 
    login, 
    logout,
    permissions,
    authInitialized
  };
};
