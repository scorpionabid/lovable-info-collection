
import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { UserModalContent } from './modals/UserModalContent';
import { UserViewModal } from './modals/viewModal';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  user?: any;
  mode?: 'create' | 'edit' | 'view';
  currentUserId?: string;
  currentUserRole?: string;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  user,
  mode = 'create',
  currentUserId,
  currentUserRole
}) => {
  // If in view mode, use the view-specific modal
  if (mode === 'view' && user) {
    return (
      <UserViewModal
        isOpen={isOpen}
        onClose={onClose}
        user={user}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <UserModalContent
          user={user}
          mode={mode}
          onSuccess={onSuccess}
          onClose={onClose}
          currentUserId={currentUserId}
          currentUserRole={currentUserRole}
        />
      </DialogContent>
    </Dialog>
  );
};
