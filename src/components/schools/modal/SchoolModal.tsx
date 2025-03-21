
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
  school?: any;
  onSchoolUpdated?: () => void;
  onSchoolCreated?: () => void;
  onCreated?: () => void;
  regionId?: string;
}

export const SchoolModal: React.FC<SchoolModalProps> = ({
  isOpen,
  onClose,
  schoolId,
  mode = 'edit',
  onSuccess,
  initialData,
  school,
  onSchoolUpdated,
  onSchoolCreated,
  onCreated,
  regionId
}) => {
  const { school: schoolData, isLoading, handleSuccess } = useSchoolData(schoolId, onClose);
  
  // Determine which callback to use
  const successCallback = onSuccess || onSchoolUpdated || onSchoolCreated || onCreated || handleSuccess;
  
  // Use provided initialData or school prop if available, otherwise use data from hook
  const formData = initialData || school || schoolData;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-infoline-blue" />
          </div>
        ) : (
          <SchoolForm
            onSuccess={successCallback}
            onCancel={onClose}
            initialData={formData}
            mode={mode}
            regionId={regionId}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SchoolModal;
