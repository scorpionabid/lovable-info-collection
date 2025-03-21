
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  getSchools, 
  getSchoolById, 
  createSchool, 
  updateSchool, 
  deleteSchool,
  getSchoolsByRegionId,
  getSchoolsBySectorId,
  School,
  SchoolFilter,
  SchoolSortParams,
  SchoolType,
  CreateSchoolDto,
  UpdateSchoolDto
} from '../services/schools';

export const useSchools = (filters?: SchoolFilter) => {
  const queryClient = useQueryClient();

  // Fetch all schools
  const {
    data: schools = [],
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['schools', filters],
    queryFn: () => getSchools(filters)
  });

  // Fetch school by ID
  const useSchoolById = (id: string) => {
    return useQuery({
      queryKey: ['school', id],
      queryFn: () => getSchoolById(id),
      enabled: !!id
    });
  };

  // Fetch schools by region
  const useSchoolsByRegion = (regionId: string) => {
    return useQuery({
      queryKey: ['schools', 'region', regionId],
      queryFn: () => getSchoolsByRegionId(regionId),
      enabled: !!regionId
    });
  };

  // Fetch schools by sector
  const useSchoolsBySector = (sectorId: string) => {
    return useQuery({
      queryKey: ['schools', 'sector', sectorId],
      queryFn: () => getSchoolsBySectorId(sectorId),
      enabled: !!sectorId
    });
  };

  // Create school mutation
  const createSchoolMutation = useMutation({
    mutationFn: (data: CreateSchoolDto) => createSchool(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      toast.success('Məktəb uğurla yaradıldı');
    },
    onError: (error: any) => {
      toast.error(`Məktəb yaradılarkən xəta: ${error.message}`);
    }
  });

  // Update school mutation
  const updateSchoolMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSchoolDto }) => updateSchool(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      toast.success('Məktəb uğurla yeniləndi');
    },
    onError: (error: any) => {
      toast.error(`Məktəb yenilənərkən xəta: ${error.message}`);
    }
  });

  // Delete school mutation
  const deleteSchoolMutation = useMutation({
    mutationFn: (id: string) => deleteSchool(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      toast.success('Məktəb uğurla silindi');
    },
    onError: (error: any) => {
      toast.error(`Məktəb silinərkən xəta: ${error.message}`);
    }
  });

  return {
    // Queries
    schools,
    isLoading,
    isError,
    refetch,
    useSchoolById,
    useSchoolsByRegion,
    useSchoolsBySector,
    
    // Mutations
    createSchool: createSchoolMutation.mutate,
    updateSchool: updateSchoolMutation.mutate,
    deleteSchool: deleteSchoolMutation.mutate,
    
    // Loading states
    isCreatingSchool: createSchoolMutation.isPending,
    isUpdatingSchool: updateSchoolMutation.isPending,
    isDeletingSchool: deleteSchoolMutation.isPending
  };
};
