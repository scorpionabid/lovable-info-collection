
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/lib/supabase/types";
import { UserProfile } from "./viewModal/UserProfile";
import { UserRole } from "./viewModal/UserRole";
import { UserActions } from "./viewModal/UserActions";
import { UserStats } from "./viewModal/UserStats";
import { UserAssignments } from "./viewModal/UserAssignments";

export interface UserViewModalProps {
  user: User;
  onClose: () => void;
}

export const UserViewModal: React.FC<UserViewModalProps> = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>İstifadəçi məlumatları</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <UserProfile user={user} />
            <UserActions user={user} onClose={onClose} />
          </div>
          
          <div className="md:col-span-2 space-y-4">
            <UserRole user={user} />
            <UserStats user={user} />
            <UserAssignments user={user} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserViewModal;
