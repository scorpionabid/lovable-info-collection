
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
    setUser(null);
    setUserRole(undefined);
    setLoading(false);
  }, []);

  const handleUserLoggedIn = useCallback(async (userData: any) => {
    if (!userData) {
      handleUserLoggedOut();
      return;
    }

    try {
      console.log("Handling user logged in for:", userData.email);
      // Get user data from the users table to get role information
      const { data: userProfile, error: userError } = await supabase
        .from('users')
        .select(`
          *,
          roles:role_id (
            id,
            name,
            description,
            permissions
          )
        `)
        .eq('id', userData.id)
        .single();

      if (userError) {
        console.error('Error fetching user profile:', userError);
        // Don't exit early on error, continue with basic user data
      }

      // Normalize user data to avoid TypeScript errors
      const normalizedUser = {
        id: userData.id,
        email: userData.email,
        first_name: userProfile?.first_name || userData.user_metadata?.first_name || "",
        last_name: userProfile?.last_name || userData.user_metadata?.last_name || "",
        role_id: userProfile?.role_id || userData.user_metadata?.role_id || "",
        region_id: userProfile?.region_id || userData.user_metadata?.region_id || "",
        sector_id: userProfile?.sector_id || userData.user_metadata?.sector_id || "",
        school_id: userProfile?.school_id || userData.user_metadata?.school_id || "",
        is_active: userProfile?.is_active !== undefined ? userProfile.is_active : true,
        roles: userProfile?.roles || {
          id: "",
          name: userProfile?.roles?.name || userData.user_metadata?.role || "",
          permissions: userProfile?.roles?.permissions || []
        },
        role: userProfile?.roles?.name || userData.user_metadata?.role || "",
      };

      console.log("Setting normalized user:", normalizedUser);
      setUser(normalizedUser);
      setUserRole(getNormalizedRole(normalizedUser.role));
    } catch (error) {
      console.error('Error in handleUserLoggedIn:', error);
      // If there's an error, use basic user data
      const basicUser = {
        id: userData.id,
        email: userData.email,
        first_name: userData.user_metadata?.first_name || "",
        last_name: userData.user_metadata?.last_name || "",
        role: userData.user_metadata?.role || "super-admin", // Provide a default role
      };
      
      console.log("Using basic user data due to error:", basicUser);
      setUser(basicUser);
      setUserRole(getNormalizedRole(basicUser.role));
    } finally {
      setLoading(false);
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
