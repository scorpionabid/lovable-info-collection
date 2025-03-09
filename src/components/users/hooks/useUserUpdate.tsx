
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { UserFormValues } from "../modals/UserFormSchema";
import { User } from "@/services/api/userService";
import { useToast } from "@/hooks/use-toast";
import { 
  checkUtisCodeExists, 
  prepareUserData, 
  saveUserToDatabase,
  isSchoolAdminRole
} from "./utils/userUtils";

/**
 * Hook to handle user update logic
 */
export const useUserUpdate = (
  user: User,
  onSuccess?: () => void,
  onClose?: () => void
) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const updateUserMutation = useMutation({
    mutationFn: async (values: UserFormValues) => {
      setIsUpdating(true);
      
      try {
        // Check UTIS code uniqueness
        if (values.utis_code && await checkUtisCodeExists(values.utis_code, user.id)) {
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
        
        // Update user in database
        const userData = prepareUserData(values, user.id);
        await saveUserToDatabase(userData, true);
        
        // Show success message
        toast({
          title: "İstifadəçi yeniləndi",
          description: `${values.first_name} ${values.last_name} məlumatları uğurla yeniləndi`,
        });
        
        return userData;
      } finally {
        setIsUpdating(false);
      }
    },
    onSuccess: () => {
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    },
    onError: (error) => {
      toast({
        title: "Xəta baş verdi",
        description: `Yeniləmə xətası: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  });

  return {
    updateUserMutation,
    isUpdating
  };
};
