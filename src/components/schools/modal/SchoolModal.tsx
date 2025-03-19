
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SchoolForm } from "./SchoolForm";

export interface SchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  school?: any; // School data for edit mode
  initialData?: any; // Alternative name for school prop
  onSuccess?: () => void;
  onSchoolCreated?: () => void;
  onSchoolUpdated?: () => void;
  regionId?: string; // Added for RegionDetails.tsx
  defaultRegionId?: string; // Alternative name for regionId
  sectorId?: string;
  defaultSectorId?: string; // Alternative name for sectorId
}

export const SchoolModal: React.FC<SchoolModalProps> = ({ 
  isOpen, 
  onClose, 
  mode, 
  school,
  initialData,
  onSuccess,
  onSchoolCreated,
  onSchoolUpdated,
  regionId,
  defaultRegionId,
  sectorId,
  defaultSectorId
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

  // Use either school or initialData prop
  const schoolData = initialData || school;
  
  // Use either regionId or defaultRegionId
  const finalRegionId = regionId || defaultRegionId;
  
  // Use either sectorId or defaultSectorId
  const finalSectorId = sectorId || defaultSectorId;

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
          initialData={schoolData} 
          onSuccess={handleSuccess}
          onCancel={onClose}
          defaultRegionId={finalRegionId}
          defaultSectorId={finalSectorId}
        />
      </DialogContent>
    </Dialog>
  );
};
