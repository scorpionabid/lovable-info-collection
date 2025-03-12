
import React from 'react';
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface ColumnFormFooterProps {
  isSubmitting: boolean;
  onClose: () => void;
  onSave: () => void;
  formMode: 'create' | 'edit';
}

export const ColumnFormFooter: React.FC<ColumnFormFooterProps> = ({
  isSubmitting,
  onClose,
  onSave,
  formMode
}) => {
  return (
    <DialogFooter>
      <Button 
        variant="outline" 
        onClick={onClose}
        disabled={isSubmitting}
      >
        Ləğv et
      </Button>
      <Button 
        onClick={onSave}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center">
            <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
            Gözləyin...
          </span>
        ) : formMode === 'create' ? 'Əlavə et' : 'Yadda saxla'}
      </Button>
    </DialogFooter>
  );
};
