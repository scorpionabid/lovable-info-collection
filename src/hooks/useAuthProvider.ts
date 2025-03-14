
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { getNormalizedRole } from "@/components/users/utils/userUtils";
import { toast } from "@/hooks/use-toast";

export type UserRole =
  | "super-admin"
  | "region-admin"
  | "sector-admin"
  | "school-admin";

export interface LoginCredentials {
  email: string;
  password: string;
}

export const useAuthProvider = () => {
  const [user, setUser] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<UserRole | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const navigate = useNavigate();
  
  // Compute derived values
  const isAuthenticated = !!user;
  const isLoading = loading;
  const permissions = user?.roles?.permissions || [];

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
        role: userData.user_metadata?.role || "",
      };
      
      setUser(basicUser);
      setUserRole(getNormalizedRole(basicUser.role));
    } finally {
      setLoading(false);
    }
  }, [handleUserLoggedOut]);

  // Initialize auth state
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setLoading(false);
          return;
        }
        
        if (session) {
          const { data: { user: supabaseUser }, error: userError } = await supabase.auth.getUser();
          
          if (userError) {
            console.error('User fetch error:', userError);
            handleUserLoggedOut();
            return;
          }
          
          if (supabaseUser) {
            await handleUserLoggedIn(supabaseUser);
          } else {
            handleUserLoggedOut();
          }
        } else {
          handleUserLoggedOut();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        handleUserLoggedOut();
      } finally {
        setAuthInitialized(true);
      }
    };

    loadUser();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      if (event === "SIGNED_IN" && session) {
        await handleUserLoggedIn(session.user);
      } else if (event === "SIGNED_OUT") {
        handleUserLoggedOut();
      } else if (event === "TOKEN_REFRESHED" && session) {
        // Session was refreshed, no need to fetch user data again if we already have it
        if (!user) {
          await handleUserLoggedIn(session.user);
        }
      }
    });

    // Cleanup auth listener
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [handleUserLoggedIn, handleUserLoggedOut, user]);

  const login = async (emailOrCredentials: string | LoginCredentials, password?: string) => {
    try {
      setLoading(true);
      let email: string;
      let pwd: string;
      
      if (typeof emailOrCredentials === 'string') {
        // Handle email-only login (OTP)
        email = emailOrCredentials;
        pwd = password || '';
        
        if (!pwd) {
          const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
              shouldCreateUser: false,
              emailRedirectTo: `${window.location.origin}/dashboard`,
            },
          });
          
          if (error) throw error;
          toast({
            title: "Giriş linki göndərildi",
            description: "E-poçt ünvanınızı yoxlayın və giriş linkini tıklayın",
          });
          return;
        }
      } else {
        // Handle credentials login
        email = emailOrCredentials.email;
        pwd = emailOrCredentials.password;
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pwd,
      });
      
      if (error) {
        console.error('Login error:', error);
        let errorMessage = "Giriş zamanı xəta baş verdi";
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = "E-poçt və ya şifrə yanlışdır";
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = "E-poçt təsdiqlənməyib. Zəhmət olmasa e-poçtunuzu yoxlayın";
        }
        
        toast({
          title: "Giriş xətası",
          description: errorMessage,
          variant: "destructive",
        });
        
        throw error;
      }
      
      if (data.user) {
        toast({
          title: "Uğurlu giriş",
          description: "Sistemə uğurla daxil oldunuz",
        });
        
        // Redirect to dashboard after successful login
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }
      handleUserLoggedOut();
      navigate("/login");
      toast({
        title: "Çıxış edildi",
        description: "Sistemdən uğurla çıxış edildi",
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Çıxış xətası",
        description: error.message || "Çıxış zamanı xəta baş verdi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { 
    user, 
    userRole, 
    loading, 
    isLoading, 
    isAuthenticated, 
    login, 
    logout,
    permissions,
    authInitialized
  };
};
