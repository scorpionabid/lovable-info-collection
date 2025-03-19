
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { z } from "zod";
import { SchoolForm } from "./modal/SchoolForm";

export interface SchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  school?: any; // School data for edit mode
  // Add callback props for all possible operations
  onSuccess?: () => void;
  onSchoolCreated?: () => void;
  onSchoolUpdated?: () => void;
}

export const SchoolModal: React.FC<SchoolModalProps> = ({ 
  isOpen, 
  onClose, 
  mode, 
  school,
  onSuccess,
  onSchoolCreated,
  onSchoolUpdated
}) => {
  const handleSuccess = () => {
    // Call the appropriate callback based on availability and mode
    if (onSuccess) {
      onSuccess();
    } else if (mode === 'create' && onSchoolCreated) {
      onSchoolCreated();
    } else if (mode === 'edit' && onSchoolUpdated) {
      onSchoolUpdated();
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Yeni məktəb yarat' : 'Məktəb məlumatlarını redaktə et'}
          </DialogTitle>
        </DialogHeader>
        <SchoolForm 
          mode={mode} 
          school={school} 
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};
