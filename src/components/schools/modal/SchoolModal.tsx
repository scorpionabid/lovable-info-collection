
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SchoolForm } from "./SchoolForm";
import { type School } from '@/supabase/types';

export interface SchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  school?: School;
  onSuccess?: () => void;
  initialData?: any;
  regionId?: string;
}

export const SchoolModal: React.FC<SchoolModalProps> = ({
  isOpen,
  onClose,
  mode,
  school,
  onSuccess,
  initialData,
  regionId
}) => {
  const title = mode === "create" ? "Yeni Məktəb" : "Məktəb Məlumatlarını Yenilə";
  const description = mode === "create" 
    ? "Yeni məktəb əlavə etmək üçün aşağıdakı sahələri doldurun" 
    : "Məktəb məlumatlarını redaktə etmək üçün sahələri yeniləyin";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <SchoolForm 
          mode={mode} 
          school={initialData || school} 
          onClose={onClose} 
          onSuccess={onSuccess} 
          regionId={regionId}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SchoolModal;
