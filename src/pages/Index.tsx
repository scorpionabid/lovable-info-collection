
import { useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingState } from '@/components/users/modals/LoadingState';

const Index = () => {
  const { user, userRole, isLoading, authInitialized } = useAuth();
  
  useEffect(() => {
    console.log("Index page rendered with user:", user?.email, "role:", userRole, "loading:", isLoading, "initialized:", authInitialized);
  }, [user, userRole, isLoading, authInitialized]);

  if (isLoading || !authInitialized || !userRole) {
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
