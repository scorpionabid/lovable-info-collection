
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
  role_id: string;
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
  
  // Last resort - check if we can infer the role from the role_id
  if (userData.role_id) {
    // Log this case for debugging
    console.warn('No role name found, using role_id to determine role:', userData.role_id);
    return 'school-admin'; // Default to school-admin if we can't determine
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
    // Handle API errors silently for better UX
  };
  
  // Helper to set user and derive permissions
  const setUserWithPermissions = (userData: User | null) => {
    if (!userData) {
      setUser(null);
      setPermissions([]);
      return;
    }
    
    // Determine role and normalize it
    const role = determineUserRole(userData);
    
    // Create a new user object with the normalized role
    const updatedUser = {
      ...userData,
      role
    };
    
    // Set user in state
    setUser(updatedUser);
    
    // Derive permissions based on role
    let derivedPermissions: string[] = [];
    
    // Use permissions from the database if available
    if (updatedUser.roles?.permissions) {
      derivedPermissions = [...updatedUser.roles.permissions];
    } else {
      // Or derive from role if no explicit permissions
      switch (role) {
        case 'super-admin':
        case 'superadmin':
          derivedPermissions = ['manage_all', 'view_all', 'edit_all', 'delete_all'];
          break;
        case 'region-admin':
          derivedPermissions = ['manage_region', 'view_region', 'edit_region'];
          break;
        case 'sector-admin':
          derivedPermissions = ['manage_sector', 'view_sector', 'edit_sector'];
          break;
        case 'school-admin':
          derivedPermissions = ['manage_school', 'view_school', 'edit_school'];
          break;
        default:
          derivedPermissions = [];
      }
    }
    
    setPermissions(derivedPermissions);
  };
  
  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      try {
        // Check for token and user in localStorage
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          // Parse stored user
          const userData: User = JSON.parse(storedUser);
          
          // Use the user data
          setUserWithPermissions(userData);
        } else {
          // No valid session
          setUserWithPermissions(null);
        }
      } catch (error) {
        handleApiError(error, 'Error checking session:');
        setUserWithPermissions(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, []);
  
  // Login
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const { token, user: userData } = await authService.login(credentials);
      
      // Store token and user in localStorage
      localStorage.setItem('token', token || '');
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update state
      setUserWithPermissions(userData);
      
      // Navigate back to the attempted page or home
      navigate('/', { replace: true });
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error during login';
      toast.error(`Login failed: ${errorMessage}`);
      setUserWithPermissions(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout
  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Clear state
      setUserWithPermissions(null);
      
      // Navigate to login
      navigate('/login', { replace: true });
    } catch (error) {
      handleApiError(error, 'Error during logout:');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        permissions
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
