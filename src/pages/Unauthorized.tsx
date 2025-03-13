
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle } from 'lucide-react';

const Unauthorized = () => {
  const { user, userRole } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg p-8 space-y-8 bg-white shadow-md rounded-lg">
        <div className="flex justify-center">
          <div className="p-3 bg-red-100 rounded-full">
            <Shield className="w-16 h-16 text-red-500" />
          </div>
        </div>
        
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900">İcazə yoxdur</h1>
          
          <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-md">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <p className="text-sm font-medium text-yellow-800">
                Bu bölməyə giriş üçün icazəniz yoxdur.
              </p>
            </div>
          </div>
          
          <p className="text-gray-600">
            Bu səhifəyə daxil olmaq üçün tələb olunan icazəyə malik deyilsiniz. İcazə ilə bağlı problemlər varsa, sistem administratoru ilə əlaqə saxlayın.
          </p>
          
          {user && (
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-md text-left">
              <p className="text-sm text-blue-800">
                <strong>İstifadəçi:</strong> {user.first_name} {user.last_name}
              </p>
              <p className="text-sm text-blue-800">
                <strong>Rol:</strong> {userRole}
              </p>
            </div>
          )}
          
          <div className="pt-4">
            <Button asChild className="w-full">
              <Link to="/">Ana səhifəyə qayıt</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
