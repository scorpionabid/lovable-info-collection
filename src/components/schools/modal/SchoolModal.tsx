import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
// Import properly
import SchoolForm from "./SchoolForm";

export interface SchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolId?: string;
}

export const SchoolModal: React.FC<SchoolModalProps> = ({
  isOpen,
  onClose,
  schoolId,
}) => {
  const { school, isLoading, handleSuccess } = useSchoolData(schoolId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-infoline-blue" />
          </div>
        ) : (
          <SchoolForm
            onSuccess={handleSuccess}
            onCancel={onClose}
            initialData={school}
            mode={schoolId ? "edit" : "create"}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
