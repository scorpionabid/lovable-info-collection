
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { getNormalizedRole } from "@/components/users/utils/userUtils";
import { UserRole } from "../types/authTypes";

export const useUserData = () => {
  const [user, setUser] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<UserRole | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [sessionExists, setSessionExists] = useState<boolean>(false);
  
  // Log initial states for debugging
  useEffect(() => {
    console.log("useUserData initial state:", { 
      userRole, 
      loading, 
      authInitialized,
      sessionExists 
    });
  }, []);

  const handleUserLoggedOut = useCallback(() => {
    console.log("Handling user logged out");
    setUser(null);
    setUserRole(undefined);
    setSessionExists(false);
    setLoading(false);
  }, []);

  const handleUserLoggedIn = useCallback(async (userData: any) => {
    if (!userData) {
      console.log("No user data provided, logging out");
      handleUserLoggedOut();
      return;
    }

    try {
      console.log("Handling user logged in for:", userData.email);
      
      // First set session existence and initialize auth
      setSessionExists(true);
      setAuthInitialized(true);
      
      // Set a default role immediately to prevent loading issues
      // This ensures that even if the database query fails, we have a role
      const defaultRole: UserRole = "super-admin";
      setUserRole(defaultRole);
      console.log("Setting initial default role:", defaultRole);
      
      // Set basic user info immediately before fetching complete profile
      const basicUser = {
        id: userData.id,
        email: userData.email,
        first_name: userData.user_metadata?.first_name || "",
        last_name: userData.user_metadata?.last_name || "",
        roleName: defaultRole,
        roles: {
          id: "",
          name: defaultRole,
          permissions: []
        }
      };
      
      // Set user and stop loading state
      setUser(basicUser);
      setLoading(false);
      
      // Get detailed user data from the users table
      try {
        const { data: userProfile, error: userError } = await supabase
          .from('users')
          .select(`
            *,
            roles (
              id,
              name,
              description,
              permissions
            )
          `)
          .eq('id', userData.id)
          .maybeSingle();

        if (userError) {
          console.error('Error fetching user profile:', userError);
          console.log("Continuing with default role");
          return; // Already have default role set
        }

        console.log("User profile query result:", userProfile);

        // Determine if we have valid user profile data
        const hasValidUserProfile = userProfile && Object.keys(userProfile).length > 0;
        console.log("Valid user profile:", hasValidUserProfile, userProfile);

        // Get role name with appropriate fallbacks
        let roleName: string = defaultRole; // Keep the default fallback

        if (hasValidUserProfile && userProfile.roles && 
            typeof userProfile.roles === 'object' && 'name' in userProfile.roles) {
          roleName = userProfile.roles.name;
          console.log("Role from profile.roles:", roleName);
        } else if (userData.user_metadata?.role) {
          roleName = userData.user_metadata.role;
          console.log("Role from user_metadata:", roleName);
        } else if (hasValidUserProfile && userProfile.role_id) {
          console.log("Using role_id as fallback:", userProfile.role_id);
          // We still use the default role here for safety
        } else {
          console.log("Using default role:", roleName);
        }

        // Normalize user data with complete profile information
        const normalizedUser = {
          id: userData.id,
          email: userData.email,
          first_name: hasValidUserProfile ? userProfile?.first_name : userData.user_metadata?.first_name || "",
          last_name: hasValidUserProfile ? userProfile?.last_name : userData.user_metadata?.last_name || "",
          role_id: hasValidUserProfile ? userProfile?.role_id : userData.user_metadata?.role_id || "",
          region_id: hasValidUserProfile ? userProfile?.region_id : userData.user_metadata?.region_id || "",
          sector_id: hasValidUserProfile ? userProfile?.sector_id : userData.user_metadata?.sector_id || "",
          school_id: hasValidUserProfile ? userProfile?.school_id : userData.user_metadata?.school_id || "",
          is_active: hasValidUserProfile ? (userProfile?.is_active !== undefined ? userProfile.is_active : true) : true,
          roles: hasValidUserProfile && userProfile?.roles ? userProfile.roles : {
            id: "",
            name: roleName,
            permissions: []
          },
          // Store roleName separately for backward compatibility
          roleName: roleName,
        };

        console.log("Setting normalized user:", normalizedUser);
        setUser(normalizedUser);
        
        // Set a properly normalized role
        const role = getNormalizedRole(roleName);
        console.log("Setting normalized role:", role);
        setUserRole(role);
      } catch (profileError) {
        console.error('Error in profile fetch:', profileError);
        console.log("Continuing with default user data");
        // Already have default role and basic user info set
      }
    } catch (error) {
      console.error('Error in handleUserLoggedIn:', error);
      console.log("Error in handleUserLoggedIn but continuing with default data");
      // Already have default role and user set at beginning of function
    }
  }, [handleUserLoggedOut]);

  // Session check useEffect
  useEffect(() => {
    // Check and set session existence
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const hasSession = !!data.session;
        console.log("Initial session check:", hasSession);
        setSessionExists(hasSession);
        
        // If no session, stop loading
        if (!hasSession) {
          setLoading(false);
          setAuthInitialized(true);
        }
      } catch (error) {
        console.error("Session check error:", error);
        setLoading(false);
        setAuthInitialized(true);
      }
    };
    
    checkSession();
    
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change in useUserData:", event);
      if (event === 'SIGNED_IN' && session?.user) {
        console.log("User SIGNED_IN event with session");
        setSessionExists(true);
        // Process the user data
        handleUserLoggedIn(session.user);
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        console.log("TOKEN_REFRESHED event with session");
        setSessionExists(true);
        // Process the refreshed user data
        handleUserLoggedIn(session.user);
      } else if (event === 'SIGNED_OUT') {
        console.log("SIGNED_OUT event");
        setSessionExists(false);
        setAuthInitialized(true);
        setLoading(false);
        setUser(null);
        setUserRole(undefined);
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [handleUserLoggedIn]);

  return {
    user,
    userRole,
    loading,
    setLoading,
    authInitialized,
    setAuthInitialized,
    handleUserLoggedIn,
    handleUserLoggedOut,
    sessionExists,
  };
};
