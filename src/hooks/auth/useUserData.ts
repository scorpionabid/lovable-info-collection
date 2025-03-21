
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Define role type
export type UserRole = 'super-admin' | 'region-admin' | 'sector-admin' | 'school-admin' | 'teacher' | 'unknown';

// Helper to determine role from the roles object
const determineRole = (user: any): UserRole => {
  if (!user || !user.roles) return 'unknown';
  
  const roleName = user.roles.name?.toLowerCase() || '';
  
  if (roleName.includes('super')) return 'super-admin';
  if (roleName.includes('region')) return 'region-admin';
  if (roleName.includes('sector')) return 'sector-admin';
  if (roleName.includes('school')) return 'school-admin';
  if (roleName.includes('teacher')) return 'teacher';
  
  return 'unknown';
};

export const useUserData = () => {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<UserRole>('unknown');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Get the initial session when the component mounts
    const fetchUser = async () => {
      try {
        setLoading(true);
        
        // Get the current session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw new Error(sessionError.message);
        }
        
        if (!sessionData?.session) {
          setUser(null);
          setUserRole('unknown');
          setLoading(false);
          return;
        }
        
        const userId = sessionData.session.user.id;
        
        // Fetch the user profile with role information
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select(`
            *,
            roles:role_id (
              id, 
              name,
              permissions
            )
          `)
          .eq('id', userId)
          .single();
        
        if (userError) {
          throw new Error(userError.message);
        }
        
        setUser(userData);
        setUserRole(determineRole(userData));
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
    
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          try {
            const { data, error } = await supabase
              .from('users')
              .select(`
                *,
                roles:role_id (
                  id, 
                  name,
                  permissions
                )
              `)
              .eq('id', session.user.id)
              .single();
              
            if (error) throw error;
            
            setUser(data);
            setUserRole(determineRole(data));
          } catch (err) {
            console.error('Error fetching user data after sign in:', err);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserRole('unknown');
        }
      }
    );
    
    // Clean up the subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { user, userRole, loading, error };
};
