
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useColumnForm } from './hooks/useColumnForm';
import { ColumnFormFields } from './components/ColumnFormFields';
import { ColumnFormFooter } from './components/ColumnFormFooter';
import { ColumnFormProps } from './types';

export const ColumnForm: React.FC<ColumnFormProps> = ({ 
  isOpen, 
  onClose, 
  selectedColumn, 
  formMode, 
  categoryId,
  onSuccess 
}) => {
  const {
    columnFormData,
    columnFormErrors,
    isSubmitting,
    handleColumnFormChange,
    handleColumnTypeChange,
    handleRequiredChange,
    handleSaveColumn
  } = useColumnForm(
    categoryId,
    selectedColumn,
    formMode,
    onClose,
    onSuccess
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {formMode === 'create' ? 'Yeni Sütun Əlavə Et' : 'Sütunu Redaktə Et'}
          </DialogTitle>
        </DialogHeader>
        
        <ColumnFormFields
          columnFormData={columnFormData}
          columnFormErrors={columnFormErrors}
          isSubmitting={isSubmitting}
          handleColumnFormChange={handleColumnFormChange}
          handleColumnTypeChange={handleColumnTypeChange}
          handleRequiredChange={handleRequiredChange}
        />
        
        <ColumnFormFooter
          isSubmitting={isSubmitting}
          onClose={onClose}
          onSave={handleSaveColumn}
          formMode={formMode}
        />
      </DialogContent>
    </Dialog>
  );
};
