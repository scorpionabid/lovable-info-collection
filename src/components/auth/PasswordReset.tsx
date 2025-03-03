
import { useState } from 'react';
import { ArrowLeft, AlertCircle, Mail, CheckCircle, School } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!email) {
      setError('E-mail ünvanını daxil edin');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
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
        <h1 className="text-2xl font-bold text-infoline-dark-blue">Şifrəni sıfırla</h1>
        <p className="text-infoline-dark-gray mt-2">
          E-mail ünvanınızı daxil edin və şifrə sıfırlama linki alın
        </p>
      </div>
      
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
          
          <div className="space-y-1">
            <label htmlFor="email" className="form-label">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-infoline-dark-gray h-5 w-5" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sizin@email.com"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-infoline-gray rounded-md focus:outline-none focus:ring-2 focus:ring-infoline-light-blue focus:border-transparent"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            className={`w-full py-2.5 text-white font-medium rounded-md transition-colors ${
              isLoading ? "bg-infoline-blue/70 cursor-not-allowed" : "bg-infoline-blue hover:bg-infoline-dark-blue"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Göndərilir..." : "Şifrə sıfırlama linki göndər"}
          </button>
          
          <div className="text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center text-sm text-infoline-blue hover:underline"
            >
              <ArrowLeft size={16} className="mr-1" />
              Giriş səhifəsinə qayıt
            </Link>
          </div>
        </form>
      ) : (
        <div className="text-center p-6 bg-green-50 rounded-lg border border-green-100">
          <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
          <h3 className="text-lg font-medium text-infoline-dark-blue mb-2">
            Şifrə sıfırlama linki göndərildi
          </h3>
          <p className="text-infoline-dark-gray mb-4">
            {email} ünvanına şifrə sıfırlama təlimatları göndərildi.
            Zəhmət olmasa e-mail qutunuzu yoxlayın.
          </p>
          <Link 
            to="/login" 
            className="inline-flex items-center text-infoline-blue hover:underline"
          >
            <ArrowLeft size={16} className="mr-1" />
            Giriş səhifəsinə qayıt
          </Link>
        </div>
      )}
    </div>
  );
};
