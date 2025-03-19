
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SchoolForm } from "./modal/SchoolForm";

export interface SchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  school?: any; // School data for edit mode
  onSuccess?: () => void;
  onSchoolCreated?: () => void;
  onSchoolUpdated?: () => void;
  regionId?: string; // Added for RegionDetails.tsx
}

export const SchoolModal: React.FC<SchoolModalProps> = ({ 
  isOpen, 
  onClose, 
  mode, 
  school,
  onSuccess,
  onSchoolCreated,
  onSchoolUpdated,
  regionId
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

  // If regionId is provided, add it to the school data
  const schoolData = regionId && mode === 'create' 
    ? { ...school, region_id: regionId } 
    : school;

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
          school={schoolData} 
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};
