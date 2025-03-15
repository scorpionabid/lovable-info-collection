
import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/hooks/types/authTypes';
import { LoadingState } from '../users/modals/LoadingState';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({ 
  children, 
  allowedRoles = ['super-admin', 'region-admin', 'sector-admin', 'school-admin'] 
}: ProtectedRouteProps) => {
  const { user, userRole, isAuthenticated, isLoading, authInitialized } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('ProtectedRoute state:', { 
      isAuthenticated, 
      isLoading, 
      authInitialized, 
      userRole,
      pathname: location.pathname
    });
  }, [isAuthenticated, isLoading, authInitialized, userRole, location.pathname]);

  // Show loading state while checking authentication
  if (isLoading || !authInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingState message="Autentifikasiya yoxlanılır..." />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user doesn't have required role, redirect to unauthorized page
  if (user && userRole) {
    const hasRequiredRole = allowedRoles.some(allowedRole => userRole === allowedRole);

    if (!hasRequiredRole) {
      console.log(`Access denied. User role: ${userRole}. Allowed roles:`, allowedRoles);
      return <Navigate to="/unauthorized" replace />;
    }
  } else {
    // If user exists but userRole is undefined, show loading state
    console.log("User exists but role is undefined, showing loading state");
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingState message="İstifadəçi rolunu yoxlayırıq..." />
      </div>
    );
  }

  // Render children if authenticated and authorized
  return <>{children}</>;
};
