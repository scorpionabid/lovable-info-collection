
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { UserFormValues } from "../modals/UserFormSchema";
import { useToast } from "@/hooks/use-toast";
import { 
  checkExistingAuthUser, 
  checkExistingDatabaseUser, 
  registerAuthUser,
  handleAuthError
} from "./utils/authUtils";
import { 
  checkUtisCodeExists, 
  prepareUserData, 
  saveUserToDatabase, 
  isSchoolAdminRole
} from "./utils/userUtils";

/**
 * Hook to handle user creation logic
 */
export const useUserCreation = (
  onSuccess?: () => void,
  onClose?: () => void
) => {
  const [isCreatingAuth, setIsCreatingAuth] = useState(false);
  const { toast } = useToast();

  const createUserMutation = useMutation({
    mutationFn: async (values: UserFormValues) => {
      setIsCreatingAuth(true);
      
      try {
        // Check UTIS code uniqueness
        if (values.utis_code && await checkUtisCodeExists(values.utis_code)) {
          throw new Error("Bu UTIS kodu artıq istifadə olunur");
        }
        
        // Check if user is a school admin
        const isSchoolAdmin = await isSchoolAdminRole(values.role_id);
        
        // Make sure school admin has a school
        if (isSchoolAdmin && !values.school_id) {
          toast({
            title: "Xəbərdarlıq",
            description: "Məktəb admini üçün məktəb təyin etmək tövsiyə olunur",
            variant: "default",
          });
        }
        
        // Try to find existing user with this email
        let userId: string | undefined;
        
        // Check auth database
        const { userId: authUserId } = await checkExistingAuthUser(values.email, values.password || "");
        
        if (authUserId) {
          userId = authUserId;
          console.log('User exists in auth database, using ID:', userId);
        } else {
          // Check users table
          const { userId: dbUserId } = await checkExistingDatabaseUser(values.email);
          
          if (dbUserId) {
            userId = dbUserId;
            console.log('User already exists in database, using existing ID:', userId);
          }
        }
        
        // Create new auth user if doesn't exist
        if (!userId) {
          try {
            const result = await registerAuthUser({
              email: values.email,
              password: values.password || Math.random().toString(36).slice(-8),
              firstName: values.first_name,
              lastName: values.last_name,
              role: values.role_id
            });
            
            if (result.error) {
              const { userId: existingId, error } = await handleAuthError(
                result.error, 
                values.email, 
                values.password || ""
              );
              
              if (existingId) {
                userId = existingId;
              } else if (error) {
                throw error;
              }
            } else if (result.userId) {
              userId = result.userId;
            }
          } catch (authError) {
            throw new Error(`Autentifikasiya xətası: ${(authError as Error).message}`);
          }
        }
        
        if (!userId) {
          throw new Error('No user ID available for database operation');
        }
        
        // Save user to database
        const userData = prepareUserData(values, userId);
        await saveUserToDatabase(userData, false);
        
        // Show success message with login details
        const successMessage = `${values.first_name} ${values.last_name} uğurla yaradıldı.`;
        const showLoginDetails = values.password;
        
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
        
        return userData;
      } finally {
        setIsCreatingAuth(false);
      }
    },
    onSuccess: () => {
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    },
    onError: (error) => {
      toast({
        title: "Xəta baş verdi",
        description: `Yaratma xətası: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  });

  return {
    createUserMutation,
    isCreatingAuth
  };
};
