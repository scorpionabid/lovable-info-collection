
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { LoginCredentials } from "../types/authTypes";

export const useAuthActions = (
  handleUserLoggedIn: (userData: any) => Promise<void>,
  handleUserLoggedOut: () => void
) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (emailOrCredentials: string | LoginCredentials, password?: string) => {
    setLoading(true);
    try {
      let email: string;
      let pwd: string;
      
      if (typeof emailOrCredentials === 'string') {
        // Handle email-only login (OTP)
        email = emailOrCredentials;
        pwd = password || '';
        
        if (!pwd) {
          console.log("Attempting OTP login");
          const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
              shouldCreateUser: false,
              emailRedirectTo: `${window.location.origin}/dashboard`,
            },
          });
          
          if (error) {
            console.error("OTP login error:", error);
            toast({
              title: "Giriş xətası",
              description: error.message || "Giriş linki göndərilə bilmədi",
              variant: "destructive",
            });
            throw error;
          }
          
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
      
      console.log("Attempting password login for:", email);
      try {
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
          console.log("Login successful for:", data.user.email);
          toast({
            title: "Uğurlu giriş",
            description: "Sistemə uğurla daxil oldunuz",
          });
          
          // Redirect to dashboard after successful login
          navigate("/dashboard");
        }
      } catch (authError) {
        console.error('Supabase auth error:', authError);
        toast({
          title: "Şəbəkə xətası",
          description: "Şəbəkə xətası, offline rejimə keçildi",
          variant: "destructive",
        });
        throw authError;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    } finally {
      // Ensure loading state is always reset
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      console.log("Logging out user");
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
    login,
    logout,
    loading
  };
};
