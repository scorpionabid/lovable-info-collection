
/**
 * Məktəblər üçün hook
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as schoolsService from "../services/schools";

// Bütün məktəbləri almaq üçün hook
export const useSchools = (
  filters?: schoolsService.SchoolFilter,
  sort?: schoolsService.SchoolSortParams
) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['schools', filters, sort],
    queryFn: () => schoolsService.getSchools(filters, sort),
    keepPreviousData: true
  });

  return {
    schools: data || [],
    isLoading,
    error,
    refetch
  };
};

// Məktəb detaylarını almaq üçün hook
export const useSchool = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['school', id],
    queryFn: () => schoolsService.getSchoolById(id),
    enabled: !!id
  });

  return {
    school: data,
    isLoading,
    error
  };
};

// Region ID ilə məktəbləri almaq üçün hook
export const useSchoolsByRegion = (regionId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['schoolsByRegion', regionId],
    queryFn: () => schoolsService.getSchoolsByRegion(regionId),
    enabled: !!regionId
  });

  return {
    schools: data || [],
    isLoading,
    error
  };
};

// Sektor ID ilə məktəbləri almaq üçün hook
export const useSchoolsBySector = (sectorId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['schoolsBySector', sectorId],
    queryFn: () => schoolsService.getSchoolsBySector(sectorId),
    enabled: !!sectorId
  });

  return {
    schools: data || [],
    isLoading,
    error
  };
};

// Dropdown üçün məktəbləri almaq
export const useSchoolsDropdown = (sectorId?: string, regionId?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['schoolsDropdown', sectorId, regionId],
    queryFn: () => schoolsService.getSchoolsForDropdown(sectorId, regionId),
    enabled: !!(sectorId || regionId)
  });

  return {
    schools: data || [],
    isLoading,
    error
  };
};

// Məktəb tipləri üçün hook
export const useSchoolTypes = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['schoolTypes'],
    queryFn: () => schoolsService.getSchoolTypes()
  });

  return {
    schoolTypes: data || [],
    isLoading,
    error
  };
};

// Məktəb yaratmaq üçün hook
export const useCreateSchool = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (schoolData: schoolsService.CreateSchoolDto) => 
      schoolsService.createSchool(schoolData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['schools']);
      queryClient.invalidateQueries(['schoolsByRegion', variables.region_id]);
      queryClient.invalidateQueries(['schoolsBySector', variables.sector_id]);
      queryClient.invalidateQueries(['schoolsDropdown']);
      toast.success('Məktəb uğurla yaradıldı');
    },
    onError: (error: any) => {
      toast.error(`Xəta: ${error.message || 'Məktəb yaradılarkən problem baş verdi'}`);
    }
  });

  return mutation;
};

// Məktəb yeniləmək üçün hook
export const useUpdateSchool = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, schoolData }: { id: string; schoolData: schoolsService.UpdateSchoolDto }) => 
      schoolsService.updateSchool(id, schoolData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['schools']);
      queryClient.invalidateQueries(['school', variables.id]);
      if (variables.schoolData.region_id) {
        queryClient.invalidateQueries(['schoolsByRegion', variables.schoolData.region_id]);
      }
      if (variables.schoolData.sector_id) {
        queryClient.invalidateQueries(['schoolsBySector', variables.schoolData.sector_id]);
      }
      queryClient.invalidateQueries(['schoolsDropdown']);
      toast.success('Məktəb uğurla yeniləndi');
    },
    onError: (error: any) => {
      toast.error(`Xəta: ${error.message || 'Məktəb yenilənərkən problem baş verdi'}`);
    }
  });

  return mutation;
};

// Məktəb silmək üçün hook
export const useDeleteSchool = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => schoolsService.deleteSchool(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['schools']);
      queryClient.invalidateQueries(['schoolsDropdown']);
      toast.success('Məktəb uğurla silindi');
    },
    onError: (error: any) => {
      toast.error(`Xəta: ${error.message || 'Məktəb silinərkən problem baş verdi'}`);
    }
  });

  return mutation;
};
