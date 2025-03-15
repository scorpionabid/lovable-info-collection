
import React, { createContext, useContext, ReactNode } from "react";
import { useAuthProvider } from "@/hooks/useAuthProvider";
import { UserRole, LoginCredentials, AuthState } from "@/hooks/types/authTypes";

// Create the auth context with default values
const AuthContext = createContext<AuthState>({
  user: null,
  userRole: undefined,
  loading: true,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  permissions: [],
  authInitialized: false,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuthProvider();
  
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export type { UserRole, LoginCredentials };
