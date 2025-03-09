
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { UserFormValues } from "../modals/UserFormSchema";
import { User } from "@/services/api/userService";
import userService from "@/services/api/userService";
import authService from "@/services/api/authService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
          const { data: existingUsers } = await supabase
            .from('users')
            .select('id')
            .eq('email', values.email)
            .maybeSingle();
            
          const existingUserId = existingUsers?.id;
          
          if (existingUserId) {
            // User already exists in database
            userId = existingUserId;
            console.log('User already exists in database, using existing ID:', userId);
          } else {
            // Create new auth user if it's a new user
            try {
              const { data: authData, error: authError } = await authService.register({
                email: values.email,
                password: values.password || Math.random().toString(36).slice(-8),
                firstName: values.first_name,
                lastName: values.last_name,
                role: values.role_id
              });
              
              if (authError) throw authError;
              if (!authData?.user?.id) throw new Error('User ID not returned from auth registration');
              
              userId = authData.user.id;
              console.log('Created new auth user with ID:', userId);
            } catch (authError) {
              console.error('Auth registration error:', authError);
              throw new Error(`Autentifikasiya xətası: ${(authError as Error).message}`);
            }
          }
        }
        
        // Then create or update the user in the database
        const userData: User = {
          id: userId as string, // Important: Use the ID from auth
          email: values.email,
          first_name: values.first_name,
          last_name: values.last_name,
          role_id: values.role_id,
          utis_code: values.utis_code,
          is_active: values.is_active,
          region_id: values.region_id || undefined,
          sector_id: values.sector_id || undefined,
          school_id: values.school_id || undefined,
          phone: values.phone
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
