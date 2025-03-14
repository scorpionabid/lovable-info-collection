
import React, { createContext, useContext, ReactNode } from "react";
import { useAuthProvider, UserRole, LoginCredentials } from "@/hooks/useAuthProvider";

interface AuthContextProps {
  user: any | null;
  userRole: UserRole | undefined;
  loading: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string | LoginCredentials, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  permissions?: string[];
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  userRole: undefined,
  loading: true,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  permissions: [],
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
