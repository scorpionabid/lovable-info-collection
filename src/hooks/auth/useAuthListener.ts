
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
    const loadUser = async () => {
      try {
        setLoading(true);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          handleUserLoggedOut();
          setAuthInitialized(true);
          setLoading(false);
          return;
        }
        
        if (session) {
          console.log("Found existing session, fetching user");
          const { data: { user: supabaseUser }, error: userError } = await supabase.auth.getUser();
          
          if (userError) {
            console.error('User fetch error:', userError);
            handleUserLoggedOut();
            setAuthInitialized(true);
            setLoading(false);
            return;
          }
          
          if (supabaseUser) {
            await handleUserLoggedIn(supabaseUser);
          } else {
            handleUserLoggedOut();
          }
        } else {
          console.log("No session found, user is logged out");
          handleUserLoggedOut();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        handleUserLoggedOut();
      } finally {
        console.log("Auth initialization complete");
        setAuthInitialized(true);
        setLoading(false); // Ensure loading state is set to false here
      }
    };

    loadUser();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      if (event === "SIGNED_IN" && session) {
        console.log("User signed in, updating state");
        setLoading(true); // Set loading to true while we process the login
        try {
          await handleUserLoggedIn(session.user);
        } catch (error) {
          console.error("Error handling user login:", error);
          handleUserLoggedOut(); // Fallback to logged out state on error
        } finally {
          setLoading(false); // Always set loading to false when done
        }
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out, updating state");
        handleUserLoggedOut();
      } else if (event === "TOKEN_REFRESHED" && session) {
        console.log("Token refreshed, checking user state");
        // Only update if user state is empty
        if (!user) {
          setLoading(true);
          try {
            await handleUserLoggedIn(session.user);
          } catch (error) {
            console.error("Error handling token refresh:", error);
          } finally {
            setLoading(false);
          }
        }
      }
    });

    // Cleanup auth listener
    return () => {
      console.log("Cleaning up auth listener");
      authListener.subscription.unsubscribe();
    };
  }, [handleUserLoggedIn, handleUserLoggedOut, setLoading, setAuthInitialized, user]);
};
