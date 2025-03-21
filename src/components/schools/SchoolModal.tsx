
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import SchoolForm from "./modal/SchoolForm";
import { School } from "@/services/supabase/school/types";
import { useQuery } from "@tanstack/react-query";
import { getSchoolById } from "@/services/supabase/school/queries/schoolQueries";

export interface SchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolId?: string;
  mode?: "create" | "edit";
  initialData?: School | null;
  onSuccess?: () => void;
  regionId?: string;
  onSchoolUpdated?: () => void;
}

export const SchoolModal: React.FC<SchoolModalProps> = ({
  isOpen,
  onClose,
  schoolId,
  mode = "create",
  initialData = null,
  onSuccess,
  regionId,
  onSchoolUpdated
}) => {
  const queryClient = useQuery({
    queryKey: ["school", schoolId],
    queryFn: () => getSchoolById(schoolId as string),
    enabled: !!schoolId,
  });

  const isLoading = queryClient.isLoading;
  const schoolData = queryClient.data;

  const handleSuccess = () => {
    if (onSuccess) onSuccess();
    if (onSchoolUpdated) onSchoolUpdated();
    onClose();
  };

  // Determine which school data to use
  const schoolToUse = initialData || schoolData || null;

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
            initialData={schoolToUse}
            mode={mode}
            regionId={regionId}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SchoolModal;
