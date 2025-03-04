
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, ArrowLeft, Home, RefreshCw } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user, permissions } = useAuth();

  const goBack = () => {
    navigate(-1);
  };

  const goHome = () => {
    navigate('/');
  };

  const refresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-infoline-light-blue/10 to-white p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md animate-scale-in text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <Shield className="h-16 w-16 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-infoline-dark-blue mb-2">İcazə yoxdur</h1>
        
        <p className="text-infoline-dark-gray mb-6">
          Bu səhifəyə giriş icazəniz yoxdur. Sizin rolunuz <span className="font-semibold">{user?.role}</span> 
          bu əməliyyatı yerinə yetirmək üçün kifayət deyil.
        </p>
        
        {/* Debug information section */}
        <div className="mt-4 mb-6 text-left p-4 bg-gray-50 rounded-lg text-xs text-gray-700 overflow-auto max-h-40">
          <h3 className="font-semibold mb-2">Debug məlumatı:</h3>
          <p><strong>İstifadəçi ID:</strong> {user?.id}</p>
          <p><strong>İstifadəçi rol:</strong> {user?.role}</p>
          <p><strong>Role ID:</strong> {user?.role_id}</p>
          {user?.roles && (
            <>
              <p><strong>DB rol adı:</strong> {user.roles.name}</p>
              <p><strong>İcazələr:</strong> {permissions.join(', ') || 'Yoxdur'}</p>
            </>
          )}
        </div>
        
        <div className="flex flex-col space-y-2">
          <Button onClick={goBack} variant="outline" className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri qayıt
          </Button>
          
          <Button onClick={goHome} className="w-full">
            <Home className="mr-2 h-4 w-4" />
            Ana səhifəyə keç
          </Button>
          
          <Button onClick={refresh} variant="outline" className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Səhifəni yenilə
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
