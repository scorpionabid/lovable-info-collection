
import React, { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { createSuperAdmin } from '@/utils/createSuperAdmin';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const Login = () => {
  const [isCreatingSuperAdmin, setIsCreatingSuperAdmin] = useState(false);
  const { toast } = useToast();

  const handleCreateSuperAdmin = async () => {
    setIsCreatingSuperAdmin(true);
    try {
      const result = await createSuperAdmin();
      
      if (result.success) {
        toast({
          title: "Super Admin yaradıldı",
          description: result.message || "superadmin@edu.az hesabı uğurla yaradıldı. Şifrə: Admin123!",
        });
      } else {
        toast({
          title: "Xəta",
          description: "Super Admin yaradıla bilmədi: " + (result.message || ""),
          variant: "destructive",
        });
      }
    } catch (error) {
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
            {isCreatingSuperAdmin ? 'Yaradılır...' : 'Super Admin hesabı yarat'}
          </Button>
          <p className="mt-2 text-xs text-gray-500 text-center">
            Yalnız inkişaf məqsədləri üçün. E-poçt: superadmin@edu.az, Şifrə: Admin123!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
