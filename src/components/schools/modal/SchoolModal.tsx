
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SchoolForm } from "./SchoolForm";
import { SchoolWithStats } from '@/services/supabase/school/types';

export interface SchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  initialData?: any; // School data for edit mode
  regionId?: string; // Added for RegionDetails.tsx
  sectorId?: string;
  onSuccess?: () => void;
  onCreated?: () => void;
  onUpdated?: () => void;
}

export const SchoolModal: React.FC<SchoolModalProps> = ({ 
  isOpen, 
  onClose, 
  mode, 
  initialData,
  regionId,
  sectorId,
  onSuccess,
  onCreated,
  onUpdated
}) => {
  const handleSuccess = () => {
    // Call the appropriate callback based on availability and mode
    if (onSuccess) {
      onSuccess();
    } else if (mode === 'create' && onCreated) {
      onCreated();
    } else if (mode === 'edit' && onUpdated) {
      onUpdated();
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
          initialData={initialData} 
          onSuccess={handleSuccess} 
          onCancel={onClose}
          defaultRegionId={regionId}
          defaultSectorId={sectorId}
        />
      </DialogContent>
    </Dialog>
  );
};
