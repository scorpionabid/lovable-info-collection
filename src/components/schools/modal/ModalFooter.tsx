
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface ModalFooterProps {
  onClose: () => void;
  isSubmitting: boolean;
  mode: 'create' | 'edit';
}

export const ModalFooter = ({ onClose, isSubmitting, mode }: ModalFooterProps) => {
  return (
    <DialogFooter className="mt-6">
      <Button type="button" variant="outline" onClick={onClose}>
        Ləğv et
      </Button>
      <Button 
        type="submit" 
        className="bg-infoline-blue hover:bg-infoline-dark-blue"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Gözləyin...' : mode === 'create' ? 'Yarat' : 'Yadda saxla'}
      </Button>
    </DialogFooter>
  );
};
