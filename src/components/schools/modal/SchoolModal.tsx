
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SchoolForm } from './SchoolForm';
import { School } from '@/supabase/types';

export interface SchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  school?: School | null;
  mode: 'create' | 'edit';
  onSuccess?: () => void;
  regionId?: string;
}

export const SchoolModal: React.FC<SchoolModalProps> = ({
  isOpen,
  onClose,
  school,
  mode,
  onSuccess,
  regionId
}) => {
  const title = mode === 'create' ? 'Yeni Məktəb' : 'Məktəbi Redaktə Et';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <SchoolForm 
          school={school} 
          onClose={onClose}
          onSuccess={onSuccess}
          regionId={regionId || ''}
          mode={mode}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SchoolModal;
