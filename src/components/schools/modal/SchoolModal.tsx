
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import SchoolForm from "./SchoolForm";
import { useSchoolData } from "../hooks/useSchoolData";

export interface SchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolId?: string;
  mode?: 'create' | 'edit';
  onSuccess?: () => void;
  initialData?: any;
}

export const SchoolModal: React.FC<SchoolModalProps> = ({
  isOpen,
  onClose,
  schoolId,
  mode = 'edit',
  onSuccess,
  initialData
}) => {
  const { school, isLoading, handleSuccess } = useSchoolData(schoolId, onClose);
  
  // Use provided initialData if available, otherwise use data from hook
  const formData = initialData || school;
  const successHandler = onSuccess || handleSuccess;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-infoline-blue" />
          </div>
        ) : (
          <SchoolForm
            onSuccess={successHandler}
            onCancel={onClose}
            initialData={formData}
            mode={mode}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SchoolModal;
