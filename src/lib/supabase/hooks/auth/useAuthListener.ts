import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client'; // Updated import

interface UseAuthListenerOptions {
  redirectTo?: string;
  requireAuth?: boolean;
}

export const useAuthListener = ({
  redirectTo = '/login',
  requireAuth = true
}: UseAuthListenerOptions = {}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Setup auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsLoading(true);
        const currentUser = session?.user;
        
        if (event === 'SIGNED_OUT' || !currentUser) {
          setUser(null);
          setIsAuthenticated(false);
          
          if (requireAuth) {
            toast.info('Authentication required');
            navigate(redirectTo);
          }
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setUser(currentUser);
          setIsAuthenticated(true);
          
          if (!requireAuth) {
            navigate('/dashboard');
          }
        }
        
        setIsLoading(false);
      }
    );

    // Initial auth check
    (async () => {
      const { data } = await supabase.auth.getSession();
      const userSession = data.session;
      
      setIsAuthenticated(!!userSession);
      setUser(userSession?.user || null);
      setIsLoading(false);
      
      if (requireAuth && !userSession) {
        navigate(redirectTo);
      }
    })();

    // Cleanup
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, redirectTo, requireAuth]);

  return { isLoading, isAuthenticated, user };
};

export default useAuthListener;
