
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { UsersOverview } from '@/components/users/UsersOverview';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingState } from '@/components/users/modals/LoadingState';
import { useLogger } from '@/hooks/useLogger';

const Users = () => {
  const { user, userRole, isLoading: authLoading, authInitialized } = useAuth();
  const [pageLoading, setPageLoading] = useState(true);
  const logger = useLogger('UsersPage');
  
  useEffect(() => {
    logger.info('Users page loaded', { 
      user: user?.email,
      role: userRole,
      authInitialized
    });
    
    // If authentication is done, stop loading
    if (authInitialized) {
      const timer = setTimeout(() => {
        setPageLoading(false);
        logger.info('Users page ready');
      }, 300); // Small delay for smoother transition
      return () => clearTimeout(timer);
    }
  }, [user, userRole, authLoading, authInitialized]);

  // Show loading state if still loading auth or page
  if (authLoading || !authInitialized || pageLoading) {
    return <LoadingState message="İstifadəçilər yüklənir..." />;
  }

  return (
    <Layout userRole={userRole}>
      <UsersOverview />
    </Layout>
  );
};

export default Users;
