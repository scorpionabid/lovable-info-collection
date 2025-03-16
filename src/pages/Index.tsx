
import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingState } from '@/components/users/modals/LoadingState';
import { Card, CardContent } from '@/components/ui/card';
import { RequirementsStatus } from '@/components/settings/RequirementsStatus';

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
  if (isLoading || !authInitialized || pageLoading) {
    return <LoadingState message="Səhifə yüklənir..." />;
  }

  return (
    <Layout userRole={userRole}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-infoline-dark-blue">İnfoLine İdarəetmə Paneli</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white p-6 rounded-lg shadow-md">
                <CardContent className="p-0">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Xoş gəlmisiniz!</h2>
                  <p className="text-gray-600">
                    İnfoLine idarəetmə panelinə xoş gəlmisiniz. Sol tərəfdəki naviqasiya menyusundan istədiyiniz bölməyə keçə bilərsiniz.
                  </p>
                  
                  <div className="mt-4 p-4 bg-blue-50 rounded-md">
                    <p className="text-blue-700 text-sm">
                      <span className="font-semibold">İstifadəçi:</span> {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-blue-700 text-sm">
                      <span className="font-semibold">Rol:</span> {userRole}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white p-6 rounded-lg shadow-md">
                <CardContent className="p-0">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Bölmələr</h2>
                  <p className="text-gray-600 mb-4">
                    Sol tərəfdəki naviqasiya panelindən aşağıdakı bölmələrə keçid edə bilərsiniz:
                  </p>
                  <ul className="space-y-2">
                    {userRole === 'super-admin' && (
                      <>
                        <li className="text-gray-700">• İstifadəçilər</li>
                        <li className="text-gray-700">• Kateqoriyalar</li>
                      </>
                    )}
                    {(userRole === 'super-admin' || userRole === 'region-admin') && (
                      <li className="text-gray-700">• Regionlar</li>
                    )}
                    {(userRole === 'super-admin' || userRole === 'region-admin' || userRole === 'sector-admin') && (
                      <li className="text-gray-700">• Sektorlar</li>
                    )}
                    <li className="text-gray-700">• Məktəblər</li>
                    <li className="text-gray-700">• Hesabatlar</li>
                    <li className="text-gray-700">• Parametrlər</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <Card className="bg-white p-6 rounded-lg shadow-md h-full">
              <CardContent className="p-0">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Layihə Statusu</h2>
                <RequirementsStatus simplified={true} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
