
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import authService, { LoginCredentials } from '@/services/api/authService';
import { toast } from 'sonner';

// Define UserRole type - include both "superadmin" and "super-admin" to match what's in the database and UI
export type UserRole = 'super-admin' | 'region-admin' | 'sector-admin' | 'school-admin' | 'superadmin';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role?: UserRole; 
  role_id?: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  roles?: {
    id: string;
    name: string;
    description?: string;
    permissions: string[];
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  permissions: string[];
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  permissions: [],
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

// Helper function to normalize role names between DB and UI
const normalizeRoleName = (roleName: string): UserRole => {
  if (!roleName) return 'school-admin'; // Default role if none provided
  
  const normalizedName = roleName.toLowerCase();
  
  // Map database role names to UI role names
  if (normalizedName === 'superadmin' || normalizedName === 'super-admin') {
    return 'super-admin';
  }
  
  if (normalizedName === 'region-admin' || normalizedName === 'region admin') {
    return 'region-admin';
  }
  
  if (normalizedName === 'sector-admin' || normalizedName === 'sector admin') {
    return 'sector-admin';
  }
  
  if (normalizedName === 'school-admin' || normalizedName === 'school admin') {
    return 'school-admin';
  }
  
  // If none matched, return the original (this should not happen)
  console.warn(`Unrecognized role name: ${roleName}, using as-is`);
  return roleName as UserRole;
};

// Helper to determine role from user data
const determineUserRole = (userData: any): UserRole => {
  // First try to get from the roles object
  if (userData.roles?.name) {
    return normalizeRoleName(userData.roles.name);
  }
  
  // Then check if there's a role property
  if (userData.role) {
    return normalizeRoleName(userData.role);
  }
  
  console.warn('No role information found for user, using default role');
  return 'school-admin'; // Default role
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [permissions, setPermissions] = useState<string[]>([]);
  const navigate = useNavigate();
  
  // Error handler to prevent UI blocking from Firebase or other errors
  const handleApiError = (error: any, message: string) => {
    console.error(message, error);
    
    // Check if it's a Firebase/Firestore RPC error and handle it silently
    if (error?.message?.includes('WebChannelConnection') || 
        error?.message?.includes('Firestore') ||
        error?.code === 'resource-exhausted') {
      console.warn('Non-critical API error, continuing execution:', error.message);
      return; // Continue execution without showing error to user
    }
    
    // For other errors, show a toast notification
    toast.error('Xəta baş verdi, yenidən cəhd edin');
  };
  
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for stored user
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          // Verify token is still valid by calling getCurrentUser
          const userData = await authService.getCurrentUser();
          if (userData) {
            // Get role using our helper function
            const userRole = determineUserRole(userData);
            console.log(`Role determined as: ${userRole}`);
            
            setUser({
              id: userData.id,
              email: userData.email,
              first_name: userData.first_name,
              last_name: userData.last_name,
              role: userRole,
              role_id: userData.role_id,
              region_id: userData.region_id,
              sector_id: userData.sector_id,
              school_id: userData.school_id,
              roles: userData.roles,
            });
            
            // Get permissions
            try {
              const perms = await authService.getUserPermissions();
              setPermissions(perms);
            } catch (permError) {
              handleApiError(permError, 'Permissions loading error:');
              setPermissions([]);
            }
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        handleApiError(error, 'Auth initialization error:');
        // Still clear tokens if there was an error
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
  }, []);
  
  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const { user: userData } = await authService.login(credentials);
      
      if (userData) {
        // Get role using our helper function
        const userRole = determineUserRole(userData);
        console.log(`Login: Role determined as: ${userRole}`);
        
        const role_id = userData.role_id || userData.roles?.id || '';
        
        setUser({
          id: userData.id,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          role: userRole,
          role_id: role_id,
          region_id: userData.region_id || undefined,
          sector_id: userData.sector_id || undefined,
          school_id: userData.school_id || undefined,
          roles: userData.roles,
        });
        
        // Get permissions
        try {
          const perms = await authService.getUserPermissions();
          setPermissions(perms);
        } catch (permError) {
          handleApiError(permError, 'Permissions loading error:');
          setPermissions([]);
        }
        
        toast.success('Uğurla daxil oldunuz');
        navigate('/');
      }
    } catch (error) {
      handleApiError(error, 'Login error:');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setPermissions([]);
      navigate('/login');
      toast.success('Uğurla çıxış etdiniz');
    } catch (error) {
      handleApiError(error, 'Logout error:');
    } finally {
      setIsLoading(false);
    }
  };
  
  const isAuthenticated = !!user;
  
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, permissions }}>
      {children}
    </AuthContext.Provider>
  );
};
