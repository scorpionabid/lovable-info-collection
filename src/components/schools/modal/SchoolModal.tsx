
import React from 'react';
import { Modal } from '@/components/ui/modal';
import { School } from '@/lib/supabase/types/school';
import { SchoolModalContent } from './SchoolModalContent';

export interface SchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit' | 'view';
  school?: School;
  regionId?: string;
  onSchoolCreated?: () => void;
  onSchoolUpdated?: () => void;
}

export const SchoolModal: React.FC<SchoolModalProps> = ({
  isOpen,
  onClose,
  mode,
  school,
  regionId,
  onSchoolCreated,
  onSchoolUpdated,
}) => {
  // Generate title based on mode
  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Yeni Məktəb Əlavə Et';
      case 'edit':
        return 'Məktəbi Redaktə Et';
      case 'view':
        return 'Məktəb Məlumatları';
      default:
        return 'Məktəb';
    }
  };

  const handleSuccess = () => {
    if (mode === 'create' && onSchoolCreated) {
      onSchoolCreated();
    } else if (mode === 'edit' && onSchoolUpdated) {
      onSchoolUpdated();
    }
  };

  return (
    <Modal title={getTitle()} isOpen={isOpen} onClose={onClose}>
      <SchoolModalContent 
        mode={mode} 
        onClose={onClose} 
        initialData={school as School} 
        regionId={regionId || ''} 
        onSuccess={handleSuccess}
      />
    </Modal>
  );
};

export default SchoolModal;
