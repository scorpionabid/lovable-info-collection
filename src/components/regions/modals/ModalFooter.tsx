
import { Button } from "@/components/ui/button";

interface ModalFooterProps {
  onClose: () => void;
  isSubmitting: boolean;
  mode: 'create' | 'edit';
}

export const ModalFooter = ({ onClose, isSubmitting, mode }: ModalFooterProps) => {
  return (
    <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-infoline-light-gray">
      <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
        Ləğv et
      </Button>
      <Button 
        type="submit" 
        className="bg-infoline-blue hover:bg-infoline-dark-blue"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Yüklənir...' : mode === 'create' ? 'Yarat' : 'Yadda saxla'}
      </Button>
    </div>
  );
};
