
import { ReactNode, useEffect, useState, useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/hooks/types/authTypes';
import { LoadingState } from '../users/modals/LoadingState';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useLogger } from '@/hooks/useLogger';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({ 
  children, 
  allowedRoles = ['super-admin', 'region-admin', 'sector-admin', 'school-admin'] 
}: ProtectedRouteProps) => {
  const { 
    user,
    userRole,
    isAuthenticated, 
    isLoading,
    sessionExists,
    isUserReady
  } = useAuth();
  
  const location = useLocation();
  const [loadingScreenShown, setLoadingScreenShown] = useState(false);
  const [longLoading, setLongLoading] = useState(false);
  const logger = useLogger('ProtectedRoute');
  
  // Use useMemo to improve calculation efficiency and avoid repetition
  const isAllowed = useMemo(() => {
    // If allowedRoles is not specified, consider all authenticated users allowed
    if (!allowedRoles || allowedRoles.length === 0) {
      return isUserReady || isAuthenticated || sessionExists || Boolean(user);
    }
    
    // If roles are specified and we have a userRole, check them
    if (allowedRoles && allowedRoles.length > 0 && userRole) {
      return allowedRoles.includes(userRole);
    }
    
    // Default case - require auth but no specific role
    return isUserReady || isAuthenticated || sessionExists || Boolean(user);
  }, [isUserReady, isAuthenticated, sessionExists, user, userRole, allowedRoles]);
  
  // Show log outputs for debugging
  useEffect(() => {
    const pathname = location.pathname;
    if (!loadingScreenShown) {
      logger.info(`Route access check for ${pathname}`, { 
        isAuthenticated, 
        isLoading,
        sessionExists,
        isUserReady,
        userRole,
        allowedRoles,
        isAllowed
      });
      setLoadingScreenShown(true);
    }
  }, [isAuthenticated, isLoading, isAllowed, loadingScreenShown, location.pathname, isUserReady, sessionExists, userRole, allowedRoles]);

  // Set long loading state after 5 seconds to show refresh option
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        logger.warn('Authentication taking longer than expected');
        setLongLoading(true);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setLongLoading(false);
    }
  }, [isLoading]);

  // Handle page refresh
  const handleRefresh = () => {
    logger.info('Manual page refresh triggered by user');
    window.location.reload();
  };

  // Simplest condition system - check permission first
  if (isAllowed) {
    logger.info(`Access granted to ${location.pathname} for role ${userRole}`);
    return <>{children}</>;
  }
  
  // If still loading, show loading screen
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <LoadingState message="Autentifikasiya yoxlanılır..." />
        
        {longLoading && (
          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-4">Yüklənmə gözlənildiyindən çox vaxt aparır.</p>
            <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Səhifəni yeniləyin
            </Button>
          </div>
        )}
      </div>
    );
  }
  
  // If user exists but doesn't have permission, redirect to Unauthorized
  if (user && userRole && !isAllowed) {
    logger.warn(`Unauthorized access attempt to ${location.pathname} by ${user.email} with role ${userRole}`);
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // For all other cases, redirect to login page
  logger.info(`Redirecting unauthenticated user from ${location.pathname} to login`);
  return <Navigate to="/login" state={{ from: location }} replace />;
};
