
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

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

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // Mock implementation for demonstration
      if (email === 'admin@example.com' && password === 'password') {
        const mockUser: User = {
          id: '1',
          email: 'admin@example.com',
          name: 'Admin',
          surname: 'User',
          role: 'super-admin',
          lastActive: new Date().toISOString()
        };
        
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        navigate('/');
        return;
      }
      
      // Sample users for different roles
      if (email === 'region@example.com' && password === 'password') {
        const mockUser: User = {
          id: '2',
          email: 'region@example.com',
          name: 'Region',
          surname: 'Admin',
          role: 'region-admin',
          entityId: '1',
          entityName: 'Bakı şəhəri',
          lastActive: new Date().toISOString()
        };
        
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        navigate('/');
        return;
      }
      
      if (email === 'sector@example.com' && password === 'password') {
        const mockUser: User = {
          id: '3',
          email: 'sector@example.com',
          name: 'Sector',
          surname: 'Admin',
          role: 'sector-admin',
          entityId: '1',
          entityName: 'Yasamal sektoru',
          lastActive: new Date().toISOString()
        };
        
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        navigate('/');
        return;
      }
      
      if (email === 'school@example.com' && password === 'password') {
        const mockUser: User = {
          id: '4',
          email: 'school@example.com',
          name: 'School',
          surname: 'Admin',
          role: 'school-admin',
          entityId: '1',
          entityName: '20 nömrəli məktəb',
          lastActive: new Date().toISOString()
        };
        
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        navigate('/');
        return;
      }
      
      throw new Error('Invalid credentials');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  // Forgot password function
  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      // Mock implementation
      console.log(`Password reset requested for ${email}`);
      // In a real app, this would send a reset link to the email
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (token: string, newPassword: string) => {
    setIsLoading(true);
    try {
      // Mock implementation
      console.log(`Password reset with token ${token} and new password`);
      // In a real app, this would validate the token and update the password
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
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
