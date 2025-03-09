
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { UserFormValues } from "../modals/UserFormSchema";
import { User } from "@/services/api/userService";
import userService from "@/services/api/userService";
import authService from "@/services/api/authService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@supabase/supabase-js";

export const useUserFormSubmit = (
  user: User | undefined,
  onClose: () => void,
  onSuccess?: () => void
) => {
  const [isCreatingAuth, setIsCreatingAuth] = useState(false);
  const { toast } = useToast();
  const isEditing = !!user;

  const createUserMutation = useMutation({
    mutationFn: async (values: UserFormValues) => {
      setIsCreatingAuth(true);
      
      try {
        // Check UTIS code uniqueness one more time before submission
        if (values.utis_code) {
          const exists = await userService.checkUtisCodeExists(
            values.utis_code, 
            isEditing ? user?.id : undefined
          );
          if (exists) {
            throw new Error("Bu UTIS kodu artıq istifadə olunur");
          }
        }
        
        // Check if user is a school admin - used for role verification
        const roles = await userService.getRoles();
        const selectedRole = roles.find(r => r.id === values.role_id);
        const isSchoolAdmin = selectedRole?.name === 'school-admin';
        
        // Make sure school admin has a school
        if (isSchoolAdmin && !values.school_id) {
          toast({
            title: "Xəbərdarlıq",
            description: "Məktəb admini üçün məktəb təyin etmək tövsiyə olunur",
            variant: "default",
          });
        }
        
        let userId = user?.id;
        
        // First check if user with this email already exists in the database
        if (!isEditing) {
          // Check if user already exists in auth database
          try {
            const signInResponse = await supabase.auth
              .signInWithPassword({
                email: values.email,
                password: values.password || "dummy-password-for-check"
              });
              
            const signInError = signInResponse.error;
            const existingAuthUser = signInResponse.data;
            
            if (signInError && !signInError.message.includes('Invalid login credentials')) {
              console.error('Error checking existing auth user:', signInError);
              // Don't throw here, just log the error and continue
            } else if (existingAuthUser?.user) {
              userId = existingAuthUser.user.id;
              console.log('User exists in auth database, using ID:', userId);
            }
          } catch (e) {
            // Ignore signin errors as they usually mean the user doesn't exist
            console.log('Error during auth check:', e);
          }
            
          // Also check if user exists in our database
          if (!userId) {
            const { data: existingUsers } = await supabase
              .from('users')
              .select('id, email')
              .eq('email', values.email)
              .maybeSingle();
              
            if (existingUsers?.id) {
              // User already exists in database
              userId = existingUsers.id;
              console.log('User already exists in database, using existing ID:', userId);
            }
          }
          
          if (!userId) {
            // Create new auth user if doesn't exist anywhere
            try {
              const authResult = await authService.register({
                email: values.email,
                password: values.password || Math.random().toString(36).slice(-8),
                firstName: values.first_name,
                lastName: values.last_name,
                role: values.role_id
              });
              
              // Handle potential errors with proper typing
              if ('error' in authResult && authResult.error) {
                // Type guard to ensure error is of type AuthError or similar with a message property
                const authError = authResult.error as { message?: string };
                
                // If we get "User already registered" error, try to fetch the user ID
                if (authError.message && authError.message.includes("already registered")) {
                  try {
                    const signInResponse = await supabase.auth
                      .signInWithPassword({
                        email: values.email,
                        password: values.password || "dummy-password-for-check"
                      });
                    
                    const signinError = signInResponse.error;
                    const userData = signInResponse.data;
                      
                    if (signinError) {
                      console.error('Error signing in to retrieve user ID:', signinError);
                      throw new Error(`Autentifikasiya xətası: İstifadəçi mövcuddur, lakin giriş etmək mümkün olmadı`);
                    }
                      
                    if (userData?.user?.id) {
                      userId = userData.user.id;
                      console.log('Retrieved ID for existing auth user:', userId);
                    } else {
                      throw new Error(`Autentifikasiya xətası: İstifadəçi mövcuddur, lakin giriş etmək mümkün olmadı`);
                    }
                  } catch (signinError) {
                    console.error('Error during signin after auth error:', signinError);
                    throw new Error(`Autentifikasiya xətası: ${(signinError as Error).message}`);
                  }
                } else {
                  throw authResult.error;
                }
              } else if ('user' in authResult && authResult.user?.id) {
                userId = authResult.user.id;
                console.log('Created new auth user with ID:', userId);
              } else {
                throw new Error('User ID not returned from auth registration');
              }
            } catch (authError) {
              console.error('Auth registration error:', authError);
              throw new Error(`Autentifikasiya xətası: ${(authError as Error).message}`);
            }
          }
        }
        
        if (!userId) {
          throw new Error('No user ID available for database operation');
        }
        
        // Then create or update the user in the database
        const userData: User = {
          id: userId as string, // Important: Use the ID from auth
          email: values.email,
          first_name: values.first_name,
          last_name: values.last_name,
          role_id: values.role_id,
          utis_code: values.utis_code || undefined,
          is_active: values.is_active,
          region_id: values.region_id || null,
          sector_id: values.sector_id || null,
          school_id: values.school_id || null,
          phone: values.phone || null
        };
        
        // Show success information including login details for new users
        const successMessage = isEditing 
          ? `${values.first_name} ${values.last_name} məlumatları uğurla yeniləndi`
          : `${values.first_name} ${values.last_name} uğurla yaradıldı.`;
          
        const showLoginDetails = !isEditing && values.password;
        
        if (isEditing && user) {
          const result = await userService.updateUser(user.id, userData);
          
          // Show simple toast for updates
          toast({
            title: "İstifadəçi yeniləndi",
            description: successMessage,
          });
          
          return result;
        } else {
          // For new users, use createUser which uses UPSERT to handle potential race conditions
          const result = await userService.createUser(userData);
          
          // Show detailed toast with login info for new users
          if (showLoginDetails) {
            toast({
              title: "İstifadəçi yaradıldı",
              description: (
                <div>
                  <p>{successMessage}</p>
                  <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
                    <p><strong>Giriş məlumatları:</strong></p>
                    <p>Email: {values.email}</p>
                    <p>Şifrə: {values.password}</p>
                  </div>
                </div>
              ),
              duration: 5000,
            });
          } else {
            toast({
              title: "İstifadəçi yaradıldı",
              description: successMessage,
            });
          }
          
          return result;
        }
      } finally {
        setIsCreatingAuth(false);
      }
    },
    onSuccess: () => {
      if (onSuccess) onSuccess();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Xəta baş verdi",
        description: `${isEditing ? "Yeniləmə" : "Yaratma"} xətası: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  });

  return {
    createUserMutation,
    isCreatingAuth
  };
};
