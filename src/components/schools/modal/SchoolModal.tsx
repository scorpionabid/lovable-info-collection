
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { School } from '@/lib/supabase/types';
import SchoolModalContent from './SchoolModalContent';

export interface SchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit' | 'view';
  onSuccess?: () => void;
  initialData?: School; // Add this prop
  regionId?: string;
  onCreated?: () => void; // Add this prop for backward compatibility
}

export const SchoolModal: React.FC<SchoolModalProps> = ({
  isOpen,
  onClose,
  mode,
  onSuccess,
  initialData,
  regionId,
  onCreated,
}) => {
  // Map onCreated to onSuccess for backward compatibility
  const handleSuccess = () => {
    if (onSuccess) onSuccess();
    if (onCreated) onCreated();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Add New School' : 
             mode === 'edit' ? 'Edit School' : 'School Details'}
          </DialogTitle>
        </DialogHeader>
        <SchoolModalContent 
          mode={mode} 
          onClose={onClose} 
          onSuccess={handleSuccess}
          initialData={initialData}
          regionId={regionId}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SchoolModal;
