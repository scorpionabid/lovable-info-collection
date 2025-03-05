
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SchoolModalContent } from "./modal/SchoolModalContent";
import { SchoolModalProps } from "./modal/types";

export const SchoolModal = (props: SchoolModalProps) => {
  const { isOpen, onClose } = props;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <SchoolModalContent {...props} />
      </DialogContent>
    </Dialog>
  );
};
