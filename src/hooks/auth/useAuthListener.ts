
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAuthListener = (
  handleUserLoggedIn: (userData: any) => Promise<void>,
  handleUserLoggedOut: () => void,
  setLoading: (loading: boolean) => void,
  setAuthInitialized: (initialized: boolean) => void,
  user: any | null
) => {
  // Initialize auth state and set up listeners
  useEffect(() => {
    console.log("Initializing auth state");
    let isComponentMounted = true;
    
    const loadUser = async () => {
      try {
        setLoading(true);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          handleUserLoggedOut();
          if (isComponentMounted) setAuthInitialized(true);
          return;
        }
        
        if (session) {
          console.log("Found existing session, fetching user");
          const { data: { user: supabaseUser }, error: userError } = await supabase.auth.getUser();
          
          if (userError) {
            console.error('User fetch error:', userError);
            handleUserLoggedOut();
            if (isComponentMounted) setAuthInitialized(true);
            return;
          }
          
          if (supabaseUser) {
            await handleUserLoggedIn(supabaseUser);
            // Only set authInitialized after user data is fully processed
            if (isComponentMounted) setAuthInitialized(true);
          } else {
            handleUserLoggedOut();
            if (isComponentMounted) setAuthInitialized(true);
          }
        } else {
          console.log("No session found, user is logged out");
          handleUserLoggedOut();
          if (isComponentMounted) setAuthInitialized(true);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        handleUserLoggedOut();
        if (isComponentMounted) setAuthInitialized(true);
      } finally {
        console.log("Auth initialization complete");
        if (isComponentMounted) setLoading(false);
      }
    };

    loadUser();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      if (event === "SIGNED_IN" && session && isComponentMounted) {
        console.log("User signed in, updating state");
        setLoading(true); // Set loading to true while we process the login
        try {
          await handleUserLoggedIn(session.user);
          if (isComponentMounted) setAuthInitialized(true); // Ensure authInitialized is set after login
        } catch (error) {
          console.error("Error handling user login:", error);
          handleUserLoggedOut(); // Fallback to logged out state on error
        } finally {
          if (isComponentMounted) setLoading(false);
        }
      } else if (event === "SIGNED_OUT" && isComponentMounted) {
        console.log("User signed out, updating state");
        handleUserLoggedOut();
      } else if (event === "TOKEN_REFRESHED" && session && isComponentMounted) {
        console.log("Token refreshed, checking user state");
        // Only update if user state is empty
        if (!user) {
          setLoading(true);
          try {
            await handleUserLoggedIn(session.user);
            if (isComponentMounted) setAuthInitialized(true);
          } catch (error) {
            console.error("Error handling token refresh:", error);
          } finally {
            if (isComponentMounted) setLoading(false);
          }
        }
      }
    });

    // Cleanup auth listener and prevent state updates after unmount
    return () => {
      console.log("Cleaning up auth listener");
      isComponentMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [handleUserLoggedIn, handleUserLoggedOut, setLoading, setAuthInitialized, user]);
};
