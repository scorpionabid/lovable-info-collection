
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import SchoolForm from "./modal/SchoolForm";
import { School } from "@/services/supabase/school/types";

export interface SchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolId?: string;
  mode?: "create" | "edit";
  initialData?: School | null;
  onSuccess?: () => void;
  regionId?: string;
  school?: School;
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
  school,
  onSchoolUpdated
}) => {
  const { schoolData, isLoading, handleSuccess } = useSchoolData(schoolId, onClose);

  // Handle different callback patterns
  const handleFormSuccess = () => {
    if (onSuccess) onSuccess();
    if (onSchoolUpdated) onSchoolUpdated();
    handleSuccess();
  };

  // Determine which school data to use
  const schoolToUse = initialData || school || schoolData;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-infoline-blue" />
          </div>
        ) : (
          <SchoolForm
            onSuccess={handleFormSuccess}
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

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSchoolById } from "@/services/supabase/school/queries/schoolQueries";

export interface SchoolData {
  id?: string;
  name: string;
  code?: string;
  region_id: string;
  sector_id: string;
  type_id: string;
  address?: string;
  director?: string;
  email: string;
  phone?: string;
  status?: string;
  student_count?: number;
  teacher_count?: number;
  created_at?: string;
  updated_at?: string;
}

interface UseSchoolDataResult {
  schoolData: School | null;
  isLoading: boolean;
  handleSuccess: () => void;
}

export const useSchoolData = (
  schoolId: string | undefined,
  onClose: () => void
): UseSchoolDataResult => {
  const queryClient = useQueryClient();
  const [schoolData, setSchoolData] = useState<School | null>(null);

  const {
    data: fetchedSchool,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["school", schoolId],
    queryFn: () => getSchoolById(schoolId as string),
    enabled: !!schoolId,
  });

  useEffect(() => {
    if (fetchedSchool) {
      setSchoolData(fetchedSchool);
    }
  }, [fetchedSchool]);

  const handleSuccess = useCallback(() => {
    toast.success("Məktəb məlumatları uğurla yeniləndi!");
    queryClient.invalidateQueries({ queryKey: ["schools"] });
    onClose();
  }, [onClose, queryClient]);

  return { schoolData, isLoading, handleSuccess };
};
