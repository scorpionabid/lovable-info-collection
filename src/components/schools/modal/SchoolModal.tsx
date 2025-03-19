
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SchoolForm } from "./SchoolForm";
import { useSchoolForm } from "./useSchoolForm";

export interface SchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  initialData?: any; // School data for edit mode
  onSuccess?: () => void;
  onSchoolCreated?: () => void;
  onSchoolUpdated?: () => void;
  regionId?: string; // Added for RegionDetails.tsx
  sectorId?: string;
}

export const SchoolModal: React.FC<SchoolModalProps> = ({ 
  isOpen, 
  onClose, 
  mode, 
  initialData, 
  onSuccess,
  onSchoolCreated,
  onSchoolUpdated,
  regionId,
  sectorId
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
    ? { ...initialData, region_id: regionId } 
    : initialData;

  // Use the hook to get form functionality
  const {
    form,
    isLoading,
    isSubmitting,
    errorMessage,
    regions,
    sectors,
    schoolTypes,
    handleRegionChange,
    handleSubmit
  } = useSchoolForm({
    mode,
    initialData: schoolData,
    onSuccess: handleSuccess,
    regionId
  });

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
          onCancel={onClose}
          defaultRegionId={regionId}
          defaultSectorId={sectorId}
          form={form}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
          regions={regions}
          sectors={sectors}
          schoolTypes={schoolTypes}
          onRegionChange={handleRegionChange}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};
