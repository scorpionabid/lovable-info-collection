
import React, { ReactNode } from 'react';
import { AuthContext, UserRole } from '@/contexts/AuthContext';

interface AuthContextMockProps {
  children: ReactNode;
  userRole?: UserRole;
  isAuthenticated?: boolean;
  user?: any;
}

export const AuthContextMock = ({ 
  children, 
  userRole = 'super_admin', 
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
    login: jest.fn(() => Promise.resolve({ success: true })),
    logout: jest.fn(() => Promise.resolve()),
    resetPassword: jest.fn(() => Promise.resolve({ success: true })),
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
