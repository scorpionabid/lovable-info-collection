
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const goBack = () => {
    navigate(-1);
  };

  const goHome = () => {
    navigate('/');
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
        
        <div className="flex flex-col space-y-2">
          <Button onClick={goBack} variant="outline" className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri qayıt
          </Button>
          
          <Button onClick={goHome} className="w-full">
            Ana səhifəyə keç
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
