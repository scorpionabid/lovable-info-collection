
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth, LoginCredentials } from '@/contexts/AuthContext';
import { LogIn, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';

// Validation schema
const loginSchema = z.object({
  email: z.string().email("Email düzgün formatda deyil"),
  password: z.string().min(8, "Şifrə minimum 8 simvol olmalıdır"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const { login, isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log("User is authenticated, redirecting to dashboard");
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Initialize form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError(null);
      setIsSubmitting(true);
      console.log("Form submitted, attempting login");
      
      // Ensure we have a value for each required field
      const credentials: LoginCredentials = {
        email: data.email,
        password: data.password,
      };
      
      await login(credentials);
      // Login success is handled in useAuthProvider (navigation and toast notification)
    } catch (err: any) {
      console.error('Login form error:', err);
      
      let errorMessage = "Daxil etdiyiniz məlumatlar yanlışdır";
      
      // Handle specific Supabase errors
      if (err?.message) {
        if (err.message.includes('Failed to fetch')) {
          errorMessage = "Əlaqə xətası: Supabase serverinə qoşulmaq mümkün olmadı";
        } else if (err.message.includes('Invalid login credentials')) {
          errorMessage = "Yanlış email və ya şifrə";
        } else if (err.message.includes('Email not confirmed')) {
          errorMessage = "Email təsdiqlənməyib. Zəhmət olmasa email-i yoxlayın";
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      
      toast({
        title: "Giriş xətası",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      // Always make sure to reset submission state regardless of outcome
      setIsSubmitting(false);
    }
  };

  // Sample login credentials
  const sampleCredentials = [
    { role: 'Super Admin', email: 'superadmin@edu.az', password: 'Admin123!' },
    { role: 'Region Admin', email: 'region@infoline.az', password: 'infoline123' },
    { role: 'Sector Admin', email: 'sector@infoline.az', password: 'infoline123' },
    { role: 'School Admin', email: 'school@infoline.az', password: 'infoline123' },
  ];

  const fillCredentials = (email: string, password: string) => {
    form.setValue('email', email);
    form.setValue('password', password);
  };

  // Use local isSubmitting state rather than the global loading state
  const isDisabled = isSubmitting;

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-infoline-dark-blue">InfoLine</h1>
        <p className="text-infoline-dark-gray mt-2">Məlumat İdarəetmə Sistemi</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="email@example.com" 
                    {...field} 
                    disabled={isDisabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Şifrə</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="********" 
                    {...field} 
                    disabled={isDisabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {error && (
            <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
              <AlertTitle className="text-sm font-medium">Xəta</AlertTitle>
              <AlertDescription className="text-xs">{error}</AlertDescription>
            </Alert>
          )}
          
          <Button 
            type="submit" 
            className="w-full bg-infoline-blue hover:bg-infoline-dark-blue"
            disabled={isDisabled}
          >
            {isDisabled ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Giriş edilir...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Giriş
              </>
            )}
          </Button>
          
          <div className="text-center">
            <Link 
              to="/password-reset" 
              className="text-sm text-infoline-blue hover:underline"
            >
              Şifrəni unutmusunuz?
            </Link>
          </div>
        </form>
      </Form>
      
      <div className="mt-10 border-t pt-6">
        <p className="text-sm text-center text-infoline-dark-gray mb-4">
          Demo giriş məlumatları:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {sampleCredentials.map((cred, index) => (
            <Button
              key={index}
              type="button"
              variant="outline"
              className="text-xs justify-start"
              onClick={() => fillCredentials(cred.email, cred.password)}
              disabled={isDisabled}
            >
              <span className="mr-2 font-medium">{cred.role}:</span>
              {cred.email}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
