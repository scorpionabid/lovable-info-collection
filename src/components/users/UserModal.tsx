
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserModalContent } from "./modals/UserModalContent";
import { User } from "@/supabase/types";

export interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User;
  mode: "create" | "edit" | "view";
  onSuccess?: () => void;
  currentUserRole?: string;
  currentUserId?: string;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  user,
  mode,
  onSuccess,
  currentUserRole,
  currentUserId
}) => {
  const title = mode === "create" 
    ? "Yeni İstifadəçi" 
    : mode === "edit" 
      ? "İstifadəçini Redaktə Et" 
      : "İstifadəçi Məlumatları";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <UserModalContent 
          user={user} 
          mode={mode} 
          onSuccess={() => {
            if (onSuccess) onSuccess();
            onClose();
          }}
          currentUserRole={currentUserRole}
          currentUserId={currentUserId}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;
