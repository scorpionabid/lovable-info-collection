import { ReactNode, useEffect, useState, useMemo } from 'react';
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
  
  // useMemo ilə hesablama effektivliyini artırırıq və təkrarlanmalardan qaçırıq
  const isAllowed = useMemo(() => {
    // Əgər icazələr varsa, onları yoxlayırıq
    if (allowedRoles && allowedRoles.length > 0 && userRole) {
      return allowedRoles.includes(userRole);
    }
    
    // İcazələrdən asılı olmayaraq, əsas autentifikasiya yoxlanışı
    return isUserReady || isAuthenticated || sessionExists || Boolean(user);
  }, [isUserReady, isAuthenticated, sessionExists, user, userRole, allowedRoles]);
  
  // Lazım olmayan yenidən renderləri və log çıxışlarını azaltmaq üçün
  useEffect(() => {
    const pathname = location.pathname;
    // Yalnız kritik dəyərlər dəyişdikdə log çıxaraq
    if (!loadingScreenShown) {
      console.log(`ProtectedRoute state for ${pathname}:`, { 
        isAuthenticated, 
        isLoading,
        sessionExists,
        isUserReady,
        userRole,
        isAllowed
      });
      setLoadingScreenShown(true);
    }
  }, [isAuthenticated, isLoading, isAllowed, loadingScreenShown, location.pathname]);

  // Ən sadə şərt sistemi - əvvəlcə icazə yoxlaması
  if (isAllowed) {
    return <>{children}</>;
  }
  
  // Əgər hələ yüklənirsə, gözləmə ekranını göstər
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <LoadingState message="Autentifikasiya yoxlanılır..." />
      </div>
    );
  }
  
  // İstifadəçi var amma icazəsi yoxdursa, Unauthorized səhifəsinə yönləndir
  if (user && userRole && !isAllowed) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // Digər bütün hallarda login səhifəsinə yönləndir
  return <Navigate to="/login" state={{ from: location }} replace />;
};