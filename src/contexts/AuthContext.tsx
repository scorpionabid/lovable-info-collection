
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import authService, { LoginCredentials } from '@/services/api/authService';
import { useToast } from '@/hooks/use-toast';

// User role types
export type UserRole = 'super-admin' | 'region-admin' | 'sector-admin' | 'school-admin';

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  surname: string;
  role: UserRole;
  entityId?: string; // Region, sector or school ID depending on role
  entityName?: string;
  lastActive: string;
}

// Permissions interface
export interface Permissions {
  canCreateUsers: boolean;
  canModifyUsers: boolean;
  canDeleteUsers: boolean;
  canCreateRegions: boolean;
  canModifyRegions: boolean;
  canDeleteRegions: boolean;
  canCreateSectors: boolean;
  canModifySectors: boolean;
  canDeleteSectors: boolean;
  canCreateSchools: boolean;
  canModifySchools: boolean;
  canDeleteSchools: boolean;
  canCreateCategories: boolean;
  canModifyCategories: boolean;
  canDeleteCategories: boolean;
  canApproveData: boolean;
  canRejectData: boolean;
  canExportData: boolean;
  canImportData: boolean;
}

interface AuthContextType {
  user: User | null;
  permissions: Permissions | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default permissions based on user role
const getDefaultPermissions = (role: UserRole): Permissions => {
  switch (role) {
    case 'super-admin':
      return {
        canCreateUsers: true,
        canModifyUsers: true,
        canDeleteUsers: true,
        canCreateRegions: true,
        canModifyRegions: true,
        canDeleteRegions: true,
        canCreateSectors: true,
        canModifySectors: true,
        canDeleteSectors: true,
        canCreateSchools: true,
        canModifySchools: true,
        canDeleteSchools: true,
        canCreateCategories: true,
        canModifyCategories: true,
        canDeleteCategories: true,
        canApproveData: true,
        canRejectData: true,
        canExportData: true,
        canImportData: true,
      };
    case 'region-admin':
      return {
        canCreateUsers: true,
        canModifyUsers: true,
        canDeleteUsers: false,
        canCreateRegions: false,
        canModifyRegions: true,
        canDeleteRegions: false,
        canCreateSectors: true,
        canModifySectors: true,
        canDeleteSectors: true,
        canCreateSchools: true,
        canModifySchools: true,
        canDeleteSchools: true,
        canCreateCategories: false,
        canModifyCategories: false,
        canDeleteCategories: false,
        canApproveData: true,
        canRejectData: true,
        canExportData: true,
        canImportData: true,
      };
    case 'sector-admin':
      return {
        canCreateUsers: false,
        canModifyUsers: false,
        canDeleteUsers: false,
        canCreateRegions: false,
        canModifyRegions: false,
        canDeleteRegions: false,
        canCreateSectors: false,
        canModifySectors: true,
        canDeleteSectors: false,
        canCreateSchools: true,
        canModifySchools: true,
        canDeleteSchools: false,
        canCreateCategories: false,
        canModifyCategories: false,
        canDeleteCategories: false,
        canApproveData: true,
        canRejectData: true,
        canExportData: true,
        canImportData: true,
      };
    case 'school-admin':
      return {
        canCreateUsers: false,
        canModifyUsers: false,
        canDeleteUsers: false,
        canCreateRegions: false,
        canModifyRegions: false,
        canDeleteRegions: false,
        canCreateSectors: false,
        canModifySectors: false,
        canDeleteSectors: false,
        canCreateSchools: false,
        canModifySchools: true,
        canDeleteSchools: false,
        canCreateCategories: false,
        canModifyCategories: false,
        canDeleteCategories: false,
        canApproveData: false,
        canRejectData: false,
        canExportData: true,
        canImportData: true,
      };
    default:
      return {
        canCreateUsers: false,
        canModifyUsers: false,
        canDeleteUsers: false,
        canCreateRegions: false,
        canModifyRegions: false,
        canDeleteRegions: false,
        canCreateSectors: false,
        canModifySectors: false,
        canDeleteSectors: false,
        canCreateSchools: false,
        canModifySchools: false,
        canDeleteSchools: false,
        canCreateCategories: false,
        canModifyCategories: false,
        canDeleteCategories: false,
        canApproveData: false,
        canRejectData: false,
        canExportData: false,
        canImportData: false,
      };
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<Permissions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const savedToken = localStorage.getItem('token');
        
        if (savedToken) {
          // Get current user from API
          const userData = await authService.getCurrentUser();
          setUser(userData);
          
          // Get user permissions
          try {
            const permissionsData = await authService.getUserPermissions();
            setPermissions(permissionsData);
          } catch (error) {
            // Fallback to default permissions based on role
            if (userData?.role) {
              setPermissions(getDefaultPermissions(userData.role));
            }
          }
        }
      } catch (error) {
        // Clear localStorage if authentication fails
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setPermissions(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      
      // In the real implementation, this would call the API
      const response = await authService.login(credentials);
      
      // Store token in localStorage
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      // Store user data
      const userData = response.user;
      setUser(userData);
      
      // Get permissions
      try {
        const permissionsData = await authService.getUserPermissions();
        setPermissions(permissionsData);
      } catch (error) {
        // Fallback to default permissions based on role
        if (userData?.role) {
          setPermissions(getDefaultPermissions(userData.role));
        }
      }
      
      // Navigate to appropriate dashboard based on role
      navigate('/');
      
      toast({
        title: "Giriş uğurlu oldu",
        description: "Xoş gəlmisiniz!",
      });
    } catch (error) {
      const err = error as Error;
      toast({
        title: "Giriş xətası",
        description: err.message || "Daxil etdiyiniz məlumatlar yanlışdır",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Call logout API
      await authService.logout();
      
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Reset state
      setUser(null);
      setPermissions(null);
      
      // Navigate to login
      navigate('/login');
      
      toast({
        title: "Çıxış edildi",
        description: "Sistemdən çıxış etdiniz",
      });
    } catch (error) {
      // Still clear local storage and state on error
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setPermissions(null);
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password function
  const forgotPassword = async (email: string) => {
    try {
      setIsLoading(true);
      await authService.forgotPassword(email);
      
      toast({
        title: "Şifrə bərpası",
        description: "Şifrə bərpası üçün email göndərildi",
      });
    } catch (error) {
      const err = error as Error;
      toast({
        title: "Xəta",
        description: err.message || "Şifrə bərpası zamanı xəta baş verdi",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (token: string, newPassword: string) => {
    try {
      setIsLoading(true);
      await authService.resetPassword({ token, newPassword });
      
      toast({
        title: "Şifrə yeniləndi",
        description: "Şifrəniz uğurla yeniləndi",
      });
      
      navigate('/login');
    } catch (error) {
      const err = error as Error;
      toast({
        title: "Xəta",
        description: err.message || "Şifrə yeniləmə zamanı xəta baş verdi",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        permissions,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
