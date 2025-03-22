
import React from 'react';
import { User } from '@/lib/supabase/types/user';
import { Modal } from '@/components/ui/modal';

interface UserEditModalProps {
  user: User;
  onClose: () => void;
  onUserUpdated: () => void;
}

export const UserEditModal: React.FC<UserEditModalProps> = ({
  user,
  onClose,
  onUserUpdated
}) => {
  return (
    <Modal 
      title="Edit User" 
      isOpen={true} 
      onClose={onClose}
    >
      <div className="p-4">
        <p>This is a placeholder for the user edit form. The full form will be implemented later.</p>
        <div className="mt-4 flex justify-end space-x-2">
          <button 
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={onUserUpdated}
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UserEditModal;
