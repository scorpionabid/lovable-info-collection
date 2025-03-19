
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SchoolForm } from './SchoolForm';

interface SchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  school?: any;
  regionId?: string;
  sectorId?: string;
  onCreated?: () => void;
  onUpdated?: () => void;
  onSuccess?: () => void;
}

export const SchoolModal: React.FC<SchoolModalProps> = ({
  isOpen,
  onClose,
  mode,
  school,
  regionId,
  sectorId,
  onCreated,
  onUpdated,
  onSuccess
}) => {
  const handleSuccess = () => {
    if (mode === 'create' && onCreated) {
      onCreated();
    } else if (mode === 'edit' && onUpdated) {
      onUpdated();
    }
    
    if (onSuccess) {
      onSuccess();
    }
    
    onClose();
  };

  const title = mode === 'create' ? 'Yeni Məktəb' : 'Məktəb Redaktəsi';

  // If regionId is provided, add it to the initial data
  const initialData = regionId ? { ...school, region_id: regionId } : school;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
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
