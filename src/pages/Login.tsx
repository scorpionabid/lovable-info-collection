
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-infoline-light-blue/10 to-white p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md animate-scale-in">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
