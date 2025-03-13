
import { useState } from "react";
import userService from "@/services/supabase/user";

export const useUtisCodeValidation = () => {
  const [isCheckingUtisCode, setIsCheckingUtisCode] = useState(false);

  const checkUtisCodeExists = async (utisCode: string, userId?: string): Promise<boolean> => {
    if (!utisCode) return false;
    
    setIsCheckingUtisCode(true);
    try {
      const exists = await userService.checkUtisCodeExists(utisCode, userId);
      return exists;
    } catch (error) {
      console.error("UTIS code check error:", error);
      return false;
    } finally {
      setIsCheckingUtisCode(false);
    }
  };

  return { 
    isCheckingUtisCode,
    checkUtisCodeExists
  };
};
