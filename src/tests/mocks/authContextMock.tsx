
import React, { ReactNode, createContext } from 'react';

// Create a local version of AuthContext for testing (not importing from @/contexts/AuthContext)
export const AuthContext = createContext<any>(null);

// Define UserRole type to match what's in the context
type UserRole = 'super-admin' | 'region-admin' | 'sector-admin' | 'school-admin';

interface AuthContextMockProps {
  children: ReactNode;
  userRole?: UserRole;
  isAuthenticated?: boolean;
  user?: any;
}

export const AuthContextMock = ({ 
  children, 
  userRole = 'super-admin', 
  isAuthenticated = true,
  user = {
    id: 'test-user-id',
    email: 'test@example.com',
    role: userRole,
    first_name: 'Test',
    last_name: 'User'
  }
}: AuthContextMockProps) => {
  const contextValue = {
    isAuthenticated,
    user,
    login: jest.fn(() => Promise.resolve({ token: 'mock-token', user })),
    logout: jest.fn(() => Promise.resolve(true)),
    resetPassword: jest.fn(() => Promise.resolve(true)),
    loading: false,
    error: null
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const withAuthContext = (
  Component: React.ComponentType<any>,
  props: Omit<AuthContextMockProps, 'children'> = {}
) => {
  return (
    <AuthContextMock {...props}>
      <Component />
    </AuthContextMock>
  );
};
