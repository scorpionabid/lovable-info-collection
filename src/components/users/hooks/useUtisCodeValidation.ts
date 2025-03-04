
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { UserFormValues } from "../modals/UserFormSchema";
import userService from "@/services/api/userService";
import { User } from "@/services/api/userService";

export const useUtisCodeValidation = (
  form: UseFormReturn<UserFormValues>,
  isEditing: boolean,
  user?: User
) => {
  const [isCheckingUtisCode, setIsCheckingUtisCode] = useState(false);
  const utisCode = form.watch("utis_code");

  useEffect(() => {
    const checkUtisCodeUniqueness = async () => {
      if (utisCode && utisCode.length >= 5) {
        setIsCheckingUtisCode(true);
        try {
          const exists = await userService.checkUtisCodeExists(utisCode, isEditing ? user?.id : undefined);
          if (exists) {
            form.setError("utis_code", { 
              type: "manual", 
              message: "Bu UTIS kodu artıq istifadə olunur" 
            });
          } else {
            form.clearErrors("utis_code");
          }
        } catch (error) {
          console.error("UTIS code check error:", error);
        } finally {
          setIsCheckingUtisCode(false);
        }
      }
    };

    const debounceCheck = setTimeout(() => {
      checkUtisCodeUniqueness();
    }, 500);

    return () => clearTimeout(debounceCheck);
  }, [utisCode, form, isEditing, user?.id]);

  return { isCheckingUtisCode };
};
