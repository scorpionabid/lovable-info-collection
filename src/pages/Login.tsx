
import React, { useState, useEffect } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { createSuperAdmin } from '@/utils/createSuperAdmin';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isCreatingSuperAdmin, setIsCreatingSuperAdmin] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'default' | 'error' | 'success'>('default');
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Reset status message after 10 seconds
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const handleCreateSuperAdmin = async () => {
    setIsCreatingSuperAdmin(true);
    setStatusMessage("Super Admin yaradılır...");
    setStatusType('default');
    
    try {
      const result = await createSuperAdmin();
      
      if (result.success) {
        setStatusMessage("Super Admin yaradıldı! Daxil olmağa cəhd edin.");
        setStatusType('success');
        toast({
          title: "Super Admin yaradıldı",
          description: result.message || "superadmin@edu.az hesabı uğurla yaradıldı. Şifrə: Admin123!",
        });
      } else {
        setStatusMessage("Xəta: " + (result.message || "Naməlum xəta"));
        setStatusType('error');
        toast({
          title: "Xəta",
          description: "Super Admin yaradıla bilmədi: " + (result.message || ""),
          variant: "destructive",
        });
      }
    } catch (error) {
      setStatusMessage("Xəta: " + (error instanceof Error ? error.message : "Naməlum xəta"));
      setStatusType('error');
      toast({
        title: "Xəta",
        description: "Super Admin yaradıla bilmədi: " + (error instanceof Error ? error.message : "Naməlum xəta"),
        variant: "destructive",
      });
    } finally {
      setIsCreatingSuperAdmin(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 bg-[url('/bg-pattern.svg')] bg-cover">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <img
            className="mx-auto h-16 w-auto"
            src="/logo.svg"
            alt="İnfoLine Logo"
          />
          <h2 className="mt-4 text-2xl font-bold text-infoline-dark-blue">
            InfoLine-a daxil olun
          </h2>
          <p className="mt-2 text-sm text-infoline-dark-gray">
            Məktəb məlumatları idarəetmə və hesabat sistemi
          </p>
        </div>
        
        <LoginForm />
        
        <div className="pt-4 border-t border-gray-200">
          <Button
            onClick={handleCreateSuperAdmin}
            disabled={isCreatingSuperAdmin}
            variant="outline"
            className="w-full text-sm"
          >
            {isCreatingSuperAdmin ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Super Admin yaradılır...
              </>
            ) : (
              'Super Admin hesabı yarat'
            )}
          </Button>
          
          {statusMessage && (
            <Alert 
              className={`mt-3 ${
                statusType === 'error' 
                  ? 'bg-red-50 border-red-200 text-red-800' 
                  : statusType === 'success'
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}
            >
              <AlertTitle className="text-sm font-medium">
                {statusType === 'error' ? 'Xəta' : statusType === 'success' ? 'Uğurlu' : 'Məlumat'}
              </AlertTitle>
              <AlertDescription className="text-xs">{statusMessage}</AlertDescription>
            </Alert>
          )}
          
          <p className="mt-4 text-xs text-gray-500 text-center">
            Super Admin: superadmin@edu.az, Şifrə: Admin123!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
