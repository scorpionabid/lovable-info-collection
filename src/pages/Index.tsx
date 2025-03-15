
import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingState } from '@/components/users/modals/LoadingState';

const Index = () => {
  const { user, userRole, isLoading, authInitialized } = useAuth();
  const [pageLoading, setPageLoading] = useState(true);
  
  useEffect(() => {
    console.log("Index page rendered with:", { 
      email: user?.email, 
      role: userRole, 
      loading: isLoading, 
      initialized: authInitialized 
    });
    
    // If authentication is done and we have a user role, stop loading
    if (authInitialized && userRole) {
      const timer = setTimeout(() => {
        setPageLoading(false);
      }, 300); // Small delay to ensure everything is ready
      return () => clearTimeout(timer);
    } else if (authInitialized && !userRole && user) {
      // If auth is initialized but we don't have a role yet
      console.warn("Auth initialized but role not set yet for user:", user.email);
    }
  }, [user, userRole, isLoading, authInitialized]);

  // Show loading state if still loading auth or page
  if (isLoading || !authInitialized || !userRole || pageLoading) {
    return <LoadingState message="Səhifə yüklənir..." />;
  }

  return (
    <Layout userRole={userRole}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-infoline-dark-blue">İnfoLine İdarəetmə Paneli</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dashboard content will go here */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Xoş gəlmisiniz!</h2>
            <p className="text-gray-600">
              İnfoLine idarəetmə panelinə xoş gəlmisiniz. Sol tərəfdəki naviqasiya menyusundan istədiyiniz bölməyə keçə bilərsiniz.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
