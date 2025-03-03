
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, School } from 'lucide-react';
import { cn } from '@/lib/utils';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!email || !password) {
      setError('Bütün sahələri doldurun');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Mock successful login
      if (email === 'admin@example.com' && password === 'password') {
        navigate('/');
      } else {
        setError('Email və ya şifrə yanlışdır');
      }
    }, 1000);
  };
  
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-infoline-blue/10 p-3 rounded-full">
            <School size={36} className="text-infoline-blue" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-infoline-dark-blue">İnfoLine Sistemə Giriş</h1>
        <p className="text-infoline-dark-gray mt-2">Məktəb Məlumatları Toplama Sistemi</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
        
        <div className="space-y-1">
          <label htmlFor="email" className="form-label">E-mail</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="sizin@email.com"
            className="input-primary"
            required
          />
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="form-label">Şifrə</label>
            <a href="/password-reset" className="text-xs text-infoline-blue hover:underline">
              Şifrəni unutmusunuz?
            </a>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-primary pr-10"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-infoline-dark-gray"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        
        <button
          type="submit"
          className={cn(
            "w-full py-2.5 text-white font-medium rounded-md transition-colors",
            isLoading ? "bg-infoline-blue/70 cursor-not-allowed" : "bg-infoline-blue hover:bg-infoline-dark-blue"
          )}
          disabled={isLoading}
        >
          {isLoading ? "Giriş edilir..." : "Daxil ol"}
        </button>
      </form>
    </div>
  );
};
