
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({ 
  children, 
  allowedRoles = ['super-admin', 'region-admin', 'sector-admin', 'school-admin', 'superadmin'] 
}: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-infoline-blue"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user doesn't have required role, redirect to unauthorized page
  if (user) {
    // Special handling for superadmin/super-admin equivalence
    const hasRequiredRole = allowedRoles.some(allowedRole => {
      // If the allowed role is super-admin, also accept superadmin, and vice versa
      if (allowedRole === 'super-admin' && user.role === 'superadmin') return true;
      if (allowedRole === 'superadmin' && user.role === 'super-admin') return true;
      return user.role === allowedRole;
    });

    if (!hasRequiredRole) {
      console.log(`Access denied. User role: ${user.role}. Allowed roles:`, allowedRoles);
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Render children if authenticated and authorized
  return <>{children}</>;
};
