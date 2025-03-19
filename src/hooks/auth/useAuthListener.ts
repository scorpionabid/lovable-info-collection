import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

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
          // Əgər sessiya mövcuddursa, user da mövcud sayılmalıdır
          // Məlumatları gözləmədən əvvəlcədən authInitialized=true təyin edək
          if (isComponentMounted) {
            setAuthInitialized(true);
          }
          
          console.log("Found existing session, fetching user");
          const { data: { user: supabaseUser }, error: userError } = await supabase.auth.getUser();
          
          if (userError) {
            console.error('User fetch error:', userError);
            handleUserLoggedOut();
            if (isComponentMounted) {
              setAuthInitialized(true);
              setLoading(false);
            }
            return;
          }
          
          if (supabaseUser) {
            console.log("User found in session, processing login");
            await handleUserLoggedIn(supabaseUser);
            if (isComponentMounted) {
              setAuthInitialized(true);
              setLoading(false);
            }
          } else {
            console.log("No user in session, logging out");
            handleUserLoggedOut();
            if (isComponentMounted) {
              setAuthInitialized(true);
              setLoading(false);
            }
          }
        } else {
          console.log("No session found, user is logged out");
          handleUserLoggedOut();
          if (isComponentMounted) {
            setAuthInitialized(true);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        handleUserLoggedOut();
        if (isComponentMounted) {
          setAuthInitialized(true);
          setLoading(false);
        }
      }
    };

    loadUser();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === "SIGNED_IN" && session && isComponentMounted) {
        console.log("User signed in, updating state");
        setLoading(true); 
        
        // İlk öncə authInitialized-i true olaraq təyin et
        if (isComponentMounted) setAuthInitialized(true);
        
        try {
          await handleUserLoggedIn(session.user);
        } catch (error) {
          console.error('Error handling user sign in:', error);
          handleUserLoggedOut();
        } finally {
          if (isComponentMounted) setLoading(false);
        }
      } 
      else if (event === "TOKEN_REFRESHED" && session && isComponentMounted) {
        console.log("Token refreshed, handling auth update");
        
        // Əvvəlcə sessiyaya görə autentifikasiyanı təyin edək
        if (isComponentMounted) setAuthInitialized(true);
        
        // Əgər sessiyadakı istifadəçi təyin olunmayıbsa
        if (!user && session.user) {
          setLoading(true);
          try {
            await handleUserLoggedIn(session.user);
          } catch (error) {
            console.error("Error handling token refresh:", error);
          } finally {
            if (isComponentMounted) setLoading(false);
          }
        } else {
          // User artıq mövcuddursa, sadəcə yükləməni dayandır
          if (isComponentMounted) setLoading(false);
        }
      } 
      else if (event === "SIGNED_OUT" && isComponentMounted) {
        console.log("User signed out, updating state");
        handleUserLoggedOut();
        if (isComponentMounted) {
          setAuthInitialized(true);
          setLoading(false);
        }
      }
    });

    return () => {
      console.log("Cleaning up auth listener");
      isComponentMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [handleUserLoggedIn, handleUserLoggedOut, setLoading, setAuthInitialized, user]);
};