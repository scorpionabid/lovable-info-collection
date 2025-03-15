
import { ReactNode, useEffect, useState } from 'react';
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
  const [longLoading, setLongLoading] = useState(false);
  const [veryLongLoading, setVeryLongLoading] = useState(false);
  const [reloadTriggered, setReloadTriggered] = useState(false);

  useEffect(() => {
    console.log('ProtectedRoute state:', { 
      isAuthenticated, 
      isLoading, 
      authInitialized, 
      userRole,
      pathname: location.pathname,
      user: user?.email
    });
    
    // Set timeouts to show different messages if loading takes too long
    let timeoutId: NodeJS.Timeout;
    let longTimeoutId: NodeJS.Timeout;
    let reloadTimeoutId: NodeJS.Timeout;
    
    if (isLoading || !authInitialized) {
      timeoutId = setTimeout(() => {
        setLongLoading(true);
      }, 3000); // Show different message after 3 seconds
      
      longTimeoutId = setTimeout(() => {
        setVeryLongLoading(true);
        console.warn("Auth loading is taking too long, might be an issue");
      }, 10000); // Show warning message after 10 seconds
      
      // After 20 seconds with no auth, offer to reload the page
      reloadTimeoutId = setTimeout(() => {
        if (!reloadTriggered && (isLoading || !authInitialized)) {
          setReloadTriggered(true);
        }
      }, 20000);
    } else {
      setLongLoading(false);
      setVeryLongLoading(false);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (longTimeoutId) clearTimeout(longTimeoutId);
      if (reloadTimeoutId) clearTimeout(reloadTimeoutId);
    };
  }, [isAuthenticated, isLoading, authInitialized, userRole, location.pathname, user?.email, reloadTriggered]);

  // Function to handle manual page reload
  const handleReload = () => {
    window.location.reload();
  };

  // Show loading state while checking authentication
  if (isLoading || !authInitialized) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <LoadingState 
          message={
            reloadTriggered
              ? "Autentifikasiya çox uzun çəkir. Səhifəni yeniləməyi sınayın..."
              : veryLongLoading 
                ? "Autentifikasiya çox uzun çəkir. Biraz gözləyin..." 
                : longLoading 
                  ? "Autentifikasiya uzun çəkir, bir az gözləyin..." 
                  : "Autentifikasiya yoxlanılır..."
          } 
        />
        
        {reloadTriggered && (
          <button 
            onClick={handleReload}
            className="mt-6 px-4 py-2 bg-infoline-light-blue text-white rounded hover:bg-infoline-dark-blue transition-colors"
          >
            Səhifəni yeniləmək
          </button>
        )}
      </div>
    );
  }

  // If user exists but userRole is undefined, we need to wait
  if (user && !userRole) {
    console.log("User exists but role is undefined, showing loading state");
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <LoadingState message={
          longLoading 
            ? "İstifadəçi rolunu yoxlamaq uzun çəkir..." 
            : "İstifadəçi rolunu yoxlayırıq..."
        } />
        
        {veryLongLoading && (
          <button 
            onClick={handleReload}
            className="mt-6 px-4 py-2 bg-infoline-light-blue text-white rounded hover:bg-infoline-dark-blue transition-colors"
          >
            Səhifəni yeniləmək
          </button>
        )}
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user doesn't have required role, redirect to unauthorized page
  if (userRole) {
    const hasRequiredRole = allowedRoles.some(allowedRole => userRole === allowedRole);

    if (!hasRequiredRole) {
      console.log(`Access denied. User role: ${userRole}. Allowed roles:`, allowedRoles);
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Render children if authenticated and authorized
  return <>{children}</>;
};
