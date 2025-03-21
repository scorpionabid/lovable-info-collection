
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ModalFooterProps {
  onClose: () => void;
  isSubmitting: boolean;
  mode: 'create' | 'edit';
}

export const ModalFooter: React.FC<ModalFooterProps> = ({ 
  onClose, 
  isSubmitting,
  mode
}) => {
  return (
    <div className="flex justify-end gap-2 pt-6">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onClose} 
        disabled={isSubmitting}
      >
        Ləğv et
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {mode === 'create' ? 'Yaradılır...' : 'Yenilənir...'}
          </>
        ) : (
          mode === 'create' ? 'Yarat' : 'Yenilə'
        )}
      </Button>
    </div>
  );
};
