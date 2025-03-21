
import { useEffect } from 'react';
import { getCurrentUser, getSession } from '@/supabase/services/auth';

export const useAuthListener = (
  handleUserLoggedIn: (userData: any) => void,
  handleUserLoggedOut: () => void,
  setLoading: (loading: boolean) => void,
  setAuthInitialized: (initialized: boolean) => void,
  currentUser: any
) => {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check if there's an active session
        const session = await getSession();
        
        if (session) {
          // Get the current user
          const user = await getCurrentUser();
          
          if (user) {
            // We have a valid session and user
            handleUserLoggedIn(user);
          } else {
            // Session exists but no user (unusual)
            handleUserLoggedOut();
          }
        } else {
          // No session, definitely logged out
          handleUserLoggedOut();
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
        handleUserLoggedOut();
      } finally {
        setLoading(false);
        setAuthInitialized(true);
      }
    };

    // Only run auth check if we haven't loaded a user yet
    if (!currentUser) {
      checkAuth();
    } else {
      // If we already have a user, just mark as initialized
      setAuthInitialized(true);
    }

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session) {
          // Get fresh user data
          const user = await getCurrentUser();
          if (user) {
            handleUserLoggedIn(user);
          }
        } else if (event === 'SIGNED_OUT') {
          handleUserLoggedOut();
        } else if (event === 'USER_UPDATED' && session) {
          // Get updated user data
          const user = await getCurrentUser();
          if (user) {
            handleUserLoggedIn(user);
          }
        }
      }
    );

    // Clean up the listener
    return () => {
      if (authListener) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [
    handleUserLoggedIn,
    handleUserLoggedOut,
    setLoading,
    setAuthInitialized,
    currentUser
  ]);
};
