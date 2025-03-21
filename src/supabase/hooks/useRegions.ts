
/**
 * Regionlar üçün hook
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as regionsService from "../services/regions";

// Bütün regionları almaq üçün hook
export const useRegions = (
  pagination?: regionsService.PaginationParams,
  sort?: regionsService.SortParams,
  filters?: regionsService.RegionFilters
) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['regions', pagination, sort, filters],
    queryFn: () => regionsService.getRegions(pagination, sort, filters),
    keepPreviousData: true
  });

  return {
    regions: data?.data || [],
    totalCount: data?.count || 0,
    isLoading,
    error,
    refetch
  };
};

// Region detaylarını almaq üçün hook
export const useRegion = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['region', id],
    queryFn: () => regionsService.getRegionById(id),
    enabled: !!id
  });

  return {
    region: data,
    isLoading,
    error
  };
};

// Dropdown üçün regionları almaq
export const useRegionsDropdown = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['regionsDropdown'],
    queryFn: () => regionsService.getRegionsForDropdown()
  });

  return {
    regions: data || [],
    isLoading,
    error
  };
};

// Region yaratmaq üçün hook
export const useCreateRegion = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (regionData: Partial<regionsService.Region>) => 
      regionsService.createRegion(regionData),
    onSuccess: () => {
      queryClient.invalidateQueries(['regions']);
      queryClient.invalidateQueries(['regionsDropdown']);
      toast.success('Region uğurla yaradıldı');
    },
    onError: (error: any) => {
      toast.error(`Xəta: ${error.message || 'Region yaradılarkən problem baş verdi'}`);
    }
  });

  return mutation;
};

// Region yeniləmək üçün hook
export const useUpdateRegion = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, regionData }: { id: string; regionData: Partial<regionsService.Region> }) => 
      regionsService.updateRegion(id, regionData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['regions']);
      queryClient.invalidateQueries(['region', variables.id]);
      queryClient.invalidateQueries(['regionsDropdown']);
      toast.success('Region uğurla yeniləndi');
    },
    onError: (error: any) => {
      toast.error(`Xəta: ${error.message || 'Region yenilənərkən problem baş verdi'}`);
    }
  });

  return mutation;
};

// Region silmək üçün hook
export const useDeleteRegion = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => regionsService.deleteRegion(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['regions']);
      queryClient.invalidateQueries(['regionsDropdown']);
      toast.success('Region uğurla silindi');
    },
    onError: (error: any) => {
      toast.error(`Xəta: ${error.message || 'Region silinərkən problem baş verdi'}`);
    }
  });

  return mutation;
};
