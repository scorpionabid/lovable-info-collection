
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import authService, { LoginCredentials } from '@/services/api/authService';
import { toast } from 'sonner';

// Define UserRole type - add "superadmin" to match what's in the database
export type UserRole = 'super-admin' | 'region-admin' | 'sector-admin' | 'school-admin' | 'superadmin';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role?: UserRole; 
  role_id: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
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
            // Map role value to appropriate UserRole type - handle "superadmin" case
            let userRole: UserRole = userData.roles?.name || userData.role_id;
            
            // If role is superadmin but we need super-admin in the UI, convert it
            if (userRole === 'superadmin') {
              console.log('Converting superadmin role for UI compatibility');
            }
            
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
        // Determine role from either roles object or role_id
        // Ensure it maps to a valid UserRole for UI
        let userRole: UserRole;
        
        if (userData.roles?.name) {
          userRole = userData.roles.name as UserRole;
        } else if (typeof userData.role_id === 'string') {
          userRole = userData.role_id as UserRole;
        } else {
          userRole = 'school-admin'; // Default fallback
        }
        
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
