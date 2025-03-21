
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import SchoolForm from "./SchoolForm";
import { School } from "@/services/supabase/school/types";
import { useQuery } from "@tanstack/react-query";
import { getSchoolById } from "@/services/supabase/school/queries/schoolQueries";

export interface SchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolId?: string;
  mode?: "create" | "edit";
  onSuccess?: () => void;
  regionId?: string;
  sectorId?: string;
  onSchoolUpdated?: () => void;
  onCreated?: () => void;
  initialData?: School; // Added initialData prop
}

export const SchoolModal: React.FC<SchoolModalProps> = ({
  isOpen,
  onClose,
  schoolId,
  mode = "create",
  onSuccess,
  regionId,
  sectorId,
  onSchoolUpdated,
  onCreated,
  initialData
}) => {
  const { data: schoolData, isLoading } = useQuery({
    queryKey: ["school", schoolId],
    queryFn: () => getSchoolById(schoolId as string),
    enabled: !!schoolId && mode === "edit" && !initialData
  });

  const handleSuccess = () => {
    if (onSuccess) onSuccess();
    if (onSchoolUpdated) onSchoolUpdated();
    if (onCreated && mode === "create") onCreated();
    onClose();
  };

  // Use initialData if provided, otherwise use data from query
  const formData = initialData || schoolData;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        {isLoading && !initialData ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-infoline-blue" />
          </div>
        ) : (
          <SchoolForm
            onSuccess={handleSuccess}
            onCancel={onClose}
            initialData={formData}
            mode={mode}
            regionId={regionId}
            sectorId={sectorId}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SchoolModal;
