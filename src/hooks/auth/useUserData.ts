
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getNormalizedRole } from "@/components/users/utils/userUtils";
import { UserRole } from "../types/authTypes";

export const useUserData = () => {
  const [user, setUser] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<UserRole | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  const handleUserLoggedOut = useCallback(() => {
    console.log("Handling user logged out");
    setUser(null);
    setUserRole(undefined);
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
      
      // Default role fallback to ensure we always have a role
      const defaultRole: UserRole = "super-admin";
      
      // Get user data from the users table to get role information
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

      // Log results for debugging
      if (userError) {
        console.error('Error fetching user profile:', userError);
        console.log("Will attempt to continue with basic user data");
      }

      console.log("User profile query result:", userProfile);

      // Determine if we have valid user profile data
      const hasValidUserProfile = userProfile && Object.keys(userProfile).length > 0;
      console.log("Valid user profile:", hasValidUserProfile, userProfile);

      // Get role name with appropriate fallbacks
      let roleName: string = defaultRole; // Always have a default fallback role

      if (hasValidUserProfile && userProfile.roles && 
          typeof userProfile.roles === 'object' && 'name' in userProfile.roles) {
        roleName = userProfile.roles.name;
        console.log("Role from profile.roles:", roleName);
      } else if (userData.user_metadata?.role) {
        roleName = userData.user_metadata.role;
        console.log("Role from user_metadata:", roleName);
      } else if (hasValidUserProfile && userProfile.role_id) {
        // If we have a role_id but no roles object, use a default based on role_id
        console.log("Using role_id as fallback:", userProfile.role_id);
        // We still use the default role here for safety
      } else {
        // Default role as fallback
        console.log("Using default role:", roleName);
      }

      // Normalize user data to avoid TypeScript errors
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
      
      // Always ensure auth is initialized and loading is finished
      setLoading(false);
      
    } catch (error) {
      console.error('Error in handleUserLoggedIn:', error);
      
      // If there's an error, use basic user data with default role
      const defaultRole: UserRole = "super-admin";
      const basicUser = {
        id: userData.id,
        email: userData.email,
        first_name: userData.user_metadata?.first_name || "",
        last_name: userData.user_metadata?.last_name || "",
        roleName: userData.user_metadata?.role || defaultRole,
        roles: {
          id: "",
          name: userData.user_metadata?.role || defaultRole,
          permissions: []
        }
      };
      
      console.log("Using basic user data due to error:", basicUser);
      setUser(basicUser);
      
      // Always ensure a role is set, even in error cases
      const role = getNormalizedRole(basicUser.roleName);
      console.log("Setting default role:", role);
      setUserRole(role);
      
      // Always finish loading on error too
      setLoading(false);
    } finally {
      console.log("User login handling completed");
    }
  }, [handleUserLoggedOut]);

  return {
    user,
    userRole,
    loading,
    setLoading,
    authInitialized,
    setAuthInitialized,
    handleUserLoggedIn,
    handleUserLoggedOut
  };
};
