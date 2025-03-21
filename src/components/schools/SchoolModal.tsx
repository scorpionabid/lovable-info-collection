import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
// Import properly
import SchoolForm from "./modal/SchoolForm";

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
  const { school, isLoading, handleSuccess } = useSchoolData(schoolId, onClose);

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

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSchoolById } from "@/services/supabase/school/queries/schoolQueries";

interface SchoolData {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  region_id: string;
  sector_id: string;
  student_count: number;
  teacher_count: number;
  status: string;
  director: string;
  created_at: string;
}

interface UseSchoolDataResult {
  school: SchoolData | null;
  isLoading: boolean;
  handleSuccess: () => void;
}

export const useSchoolData = (
  schoolId: string | undefined,
  onClose: () => void
): UseSchoolDataResult => {
  const queryClient = useQueryClient();
  const [school, setSchool] = useState<SchoolData | null>(null);

  const {
    data: schoolData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["school", schoolId],
    queryFn: () => getSchoolById(schoolId as string),
    enabled: !!schoolId,
  });

  useEffect(() => {
    if (schoolData) {
      setSchool(schoolData);
    }
  }, [schoolData]);

  const handleSuccess = useCallback(() => {
    toast.success("Məktəb məlumatları uğurla yeniləndi!");
    queryClient.invalidateQueries({ queryKey: ["schools"] });
    onClose();
  }, [onClose, queryClient]);

  return { school, isLoading, handleSuccess };
};
