
/**
 * Regionlar üçün hook
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as regionsService from "../services/regions";
import { 
  Region, 
  RegionWithStats, 
  PaginationParams, 
  SortParams, 
  RegionFilters 
} from "../types";

// Bütün regionları almaq üçün hook
export const useRegions = (
  pagination?: PaginationParams,
  sort?: SortParams,
  filters?: RegionFilters
) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['regions', pagination, sort, filters],
    queryFn: () => regionsService.getRegions(pagination, sort, filters),
    staleTime: 1000 * 60 * 5 // 5 dəqiqə
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
    enabled: !!id,
    staleTime: 1000 * 60 * 5 // 5 dəqiqə
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
    queryFn: () => regionsService.getRegionsForDropdown(),
    staleTime: 1000 * 60 * 10 // 10 dəqiqə
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
    mutationFn: (regionData: Partial<Region>) => 
      regionsService.createRegion(regionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['regions'] });
      queryClient.invalidateQueries({ queryKey: ['regionsDropdown'] });
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
    mutationFn: ({ id, regionData }: { id: string; regionData: Partial<Region> }) => 
      regionsService.updateRegion(id, regionData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['regions'] });
      queryClient.invalidateQueries({ queryKey: ['region', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['regionsDropdown'] });
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
      queryClient.invalidateQueries({ queryKey: ['regions'] });
      queryClient.invalidateQueries({ queryKey: ['regionsDropdown'] });
      toast.success('Region uğurla silindi');
    },
    onError: (error: any) => {
      toast.error(`Xəta: ${error.message || 'Region silinərkən problem baş verdi'}`);
    }
  });

  return mutation;
};
