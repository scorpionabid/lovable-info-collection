
import React from "react";
import { X } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User } from "@/services/api/userService";
import { UserAvatar } from "./UserAvatar";
import { UserHeader } from "./UserHeader";
import { UserDetails } from "./UserDetails";
import { UserPermissions } from "./UserPermissions";

interface UserViewModalProps {
  user: User;
  onClose: () => void;
}

export const UserViewModal = ({ user, onClose }: UserViewModalProps) => {
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>İstifadəçi Məlumatları</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6">
          <UserAvatar user={user} />
          
          <div className="flex-1 space-y-4">
            <UserHeader user={user} />
            
            <Separator />
            
            <UserDetails user={user} />
            
            {user.roles?.permissions && user.roles.permissions.length > 0 && (
              <>
                <Separator />
                <UserPermissions permissions={user.roles.permissions} />
              </>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Bağla</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
