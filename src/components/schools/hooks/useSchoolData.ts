
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSchoolById } from "@/services/supabase/school/queries/schoolQueries";

export interface SchoolData {
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
  code?: string;
  type_id?: string;
  type?: string;
  region?: string;
  sector?: string;
}

interface UseSchoolDataResult {
  school: SchoolData | null;
  isLoading: boolean;
  handleSuccess: () => void;
}

export const useSchoolData = (
  schoolId: string | undefined,
  onClose?: () => void
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
      // Convert from Supabase schema to our app schema
      const mappedSchool: SchoolData = {
        id: schoolData.id || '',
        name: schoolData.name || '',
        address: schoolData.address || '',
        email: schoolData.email || '',
        phone: schoolData.phone || '',
        region_id: schoolData.region_id || '',
        sector_id: schoolData.sector_id || '',
        student_count: schoolData.student_count || 0,
        teacher_count: schoolData.teacher_count || 0,
        status: schoolData.status || 'Active',
        director: schoolData.director || '',
        created_at: schoolData.created_at || '',
        code: schoolData.code,
        type_id: schoolData.type_id,
        type: schoolData.type,
        region: schoolData.region,
        sector: schoolData.sector
      };
      setSchool(mappedSchool as SchoolData);
    }
  }, [schoolData]);

  const handleSuccess = useCallback(() => {
    toast.success("Məktəb məlumatları uğurla yeniləndi!");
    queryClient.invalidateQueries({ queryKey: ["schools"] });
    if (onClose) onClose();
  }, [onClose, queryClient]);

  return { school, isLoading, handleSuccess };
};
