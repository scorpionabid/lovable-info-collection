
import { useState } from "react";
import { UserFormValues } from "../modals/UserFormSchema";
import { User } from "@/services/api/userService";
import { useUserCreation } from "./useUserCreation";
import { useUserUpdate } from "./useUserUpdate";

/**
 * Combined hook to handle both user creation and update
 */
export const useUserFormSubmit = (
  user: User | undefined,
  onClose: () => void,
  onSuccess?: () => void
) => {
  const isEditing = !!user;
  
  // Use the appropriate hook based on whether we're editing or creating
  const { createUserMutation, isCreatingAuth } = useUserCreation(onSuccess, onClose);
  const { updateUserMutation, isUpdating } = user 
    ? useUserUpdate(user, onSuccess, onClose) 
    : { updateUserMutation: null, isUpdating: false };

  // Determine which mutation to use
  const mutation = isEditing ? updateUserMutation : createUserMutation;
  const isLoading = isEditing ? isUpdating : isCreatingAuth;

  return {
    createUserMutation: mutation,
    isCreatingAuth: isLoading
  };
};
