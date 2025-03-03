
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import authService, { LoginCredentials } from '@/services/api/authService';
import { toast } from 'sonner';

// Define UserRole type
export type UserRole = 'super-admin' | 'region-admin' | 'sector-admin' | 'school-admin';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
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
  
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for stored user
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          // Verify token is still valid by calling getCurrentUser
          const userData = await authService.getCurrentUser();
          if (userData) {
            setUser({
              id: userData.id,
              email: userData.email,
              first_name: userData.first_name,
              last_name: userData.last_name,
              role: userData.roles?.name || '',
              role_id: userData.role_id,
              region_id: userData.region_id,
              sector_id: userData.sector_id,
              school_id: userData.school_id,
            });
            
            // Get permissions
            const perms = await authService.getUserPermissions();
            setPermissions(perms);
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
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
        setUser({
          id: userData.id,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          role: userData.roles?.name || '',
          role_id: userData.role_id,
          region_id: userData.region_id,
          sector_id: userData.sector_id,
          school_id: userData.school_id,
        });
        
        // Get permissions
        const perms = await authService.getUserPermissions();
        setPermissions(perms);
        
        toast.success('Uğurla daxil oldunuz');
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
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
      console.error('Logout error:', error);
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
