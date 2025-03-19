
import { X } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from "@/services/userService";
import { useContext } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserModalContent } from "./modals/UserModalContent";

interface UserModalProps {
  user?: User;
  onClose: () => void;
  onSuccess?: () => void;
}

export const UserModal = ({ user, onClose, onSuccess }: UserModalProps) => {
  const { user: authUser } = useAuth();
  const currentUserId = authUser?.id;
  const currentUserRole = authUser?.role;

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>
            {user ? "İstifadəçi Redaktəsi" : "Yeni İstifadəçi"}
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <UserModalContent 
          user={user}
          onClose={onClose}
          onSuccess={onSuccess}
          currentUserId={currentUserId}
          currentUserRole={currentUserRole}
        />
      </DialogContent>
    </Dialog>
  );
};
