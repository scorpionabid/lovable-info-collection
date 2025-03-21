
/**
 * Məktəblər üçün hook
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as schoolsService from "../services/schools";
import { 
  School, 
  SchoolFilter,
  SchoolSortParams, 
  SchoolType,
  CreateSchoolDto,
  UpdateSchoolDto
} from "../types";

// Bütün məktəbləri almaq üçün hook
export const useSchools = (filters?: SchoolFilter) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['schools', filters],
    queryFn: () => schoolsService.getSchools(filters),
    staleTime: 1000 * 60 * 5 // 5 dəqiqə
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
    enabled: !!id,
    staleTime: 1000 * 60 * 5 // 5 dəqiqə
  });

  return {
    school: data,
    isLoading,
    error
  };
};

// Məktəb və adminini birlikdə almaq üçün hook
export const useSchoolWithAdmin = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['schoolWithAdmin', id],
    queryFn: () => schoolsService.getSchoolWithAdmin(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5 // 5 dəqiqə
  });

  return {
    schoolWithAdmin: data,
    school: data?.school,
    admin: data?.admin,
    isLoading,
    error
  };
};

// Region üzrə məktəbləri almaq
export const useSchoolsByRegion = (regionId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['schoolsByRegion', regionId],
    queryFn: () => schoolsService.getSchoolsByRegionId(regionId),
    enabled: !!regionId,
    staleTime: 1000 * 60 * 5 // 5 dəqiqə
  });

  return {
    schools: data || [],
    isLoading,
    error
  };
};

// Sektor üzrə məktəbləri almaq
export const useSchoolsBySector = (sectorId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['schoolsBySector', sectorId],
    queryFn: () => schoolsService.getSchoolsBySectorId(sectorId),
    enabled: !!sectorId,
    staleTime: 1000 * 60 * 5 // 5 dəqiqə
  });

  return {
    schools: data || [],
    isLoading,
    error
  };
};

// Dropdown üçün məktəbləri almaq
export const useSchoolsDropdown = (regionId?: string, sectorId?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['schoolsDropdown', regionId, sectorId],
    queryFn: () => schoolsService.getSchoolsForDropdown(regionId, sectorId),
    enabled: regionId !== undefined || sectorId !== undefined,
    staleTime: 1000 * 60 * 10 // 10 dəqiqə
  });

  return {
    schools: data || [],
    isLoading,
    error
  };
};

// Məktəb növlərini almaq
export const useSchoolTypes = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['schoolTypes'],
    queryFn: () => schoolsService.getSchoolTypes(),
    staleTime: 1000 * 60 * 30 // 30 dəqiqə
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
    mutationFn: (schoolData: CreateSchoolDto) => 
      schoolsService.createSchool(schoolData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      queryClient.invalidateQueries({ queryKey: ['schoolsDropdown'] });
      queryClient.invalidateQueries({ queryKey: ['schoolsByRegion', variables.region_id] });
      queryClient.invalidateQueries({ queryKey: ['schoolsBySector', variables.sector_id] });
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
    mutationFn: ({ id, schoolData }: { id: string; schoolData: UpdateSchoolDto }) => 
      schoolsService.updateSchool(id, schoolData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      queryClient.invalidateQueries({ queryKey: ['school', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['schoolWithAdmin', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['schoolsDropdown'] });
      
      if (variables.schoolData.region_id) {
        queryClient.invalidateQueries({ queryKey: ['schoolsByRegion', variables.schoolData.region_id] });
      }
      
      if (variables.schoolData.sector_id) {
        queryClient.invalidateQueries({ queryKey: ['schoolsBySector', variables.schoolData.sector_id] });
      }
      
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
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      queryClient.invalidateQueries({ queryKey: ['schoolsDropdown'] });
      toast.success('Məktəb uğurla silindi');
    },
    onError: (error: any) => {
      toast.error(`Xəta: ${error.message || 'Məktəb silinərkən problem baş verdi'}`);
    }
  });

  return mutation;
};
