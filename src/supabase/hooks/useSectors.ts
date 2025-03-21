
/**
 * Sektorlar üçün hook
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as sectorsService from "../services/sectors";
import { 
  Sector, 
  SectorWithStats, 
  PaginationParams, 
  SortParams, 
  SectorFilters,
  CreateSectorDto
} from "../types";

// Bütün sektorları almaq üçün hook
export const useSectors = (
  pagination?: PaginationParams,
  sort?: SortParams,
  filters?: SectorFilters
) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['sectors', pagination, sort, filters],
    queryFn: () => sectorsService.getSectors(pagination, sort, filters),
    staleTime: 1000 * 60 * 5 // 5 dəqiqə
  });

  return {
    sectors: data?.data || [],
    totalCount: data?.count || 0,
    isLoading,
    error,
    refetch
  };
};

// Sektor detaylarını almaq üçün hook
export const useSector = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['sector', id],
    queryFn: () => sectorsService.getSectorById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5 // 5 dəqiqə
  });

  return {
    sector: data,
    isLoading,
    error
  };
};

// Region üzrə sektorları almaq
export const useSectorsByRegion = (regionId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['sectorsByRegion', regionId],
    queryFn: () => sectorsService.getSectorsByRegionId(regionId),
    enabled: !!regionId,
    staleTime: 1000 * 60 * 5 // 5 dəqiqə
  });

  return {
    sectors: data || [],
    isLoading,
    error
  };
};

// Dropdown üçün sektorları almaq
export const useSectorsDropdown = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['sectorsDropdown'],
    queryFn: () => sectorsService.getSectorsForDropdown(),
    staleTime: 1000 * 60 * 10 // 10 dəqiqə
  });

  return {
    sectors: data || [],
    isLoading,
    error
  };
};

// Sektor yaratmaq üçün hook
export const useCreateSector = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (sectorData: CreateSectorDto) => 
      sectorsService.createSector(sectorData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sectors'] });
      queryClient.invalidateQueries({ queryKey: ['sectorsByRegion', variables.region_id] });
      queryClient.invalidateQueries({ queryKey: ['sectorsDropdown'] });
      toast.success('Sektor uğurla yaradıldı');
    },
    onError: (error: any) => {
      toast.error(`Xəta: ${error.message || 'Sektor yaradılarkən problem baş verdi'}`);
    }
  });

  return mutation;
};

// Sektor yeniləmək üçün hook
export const useUpdateSector = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, sectorData }: { id: string; sectorData: Partial<Sector> }) => 
      sectorsService.updateSector(id, sectorData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sectors'] });
      queryClient.invalidateQueries({ queryKey: ['sector', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['sectorsDropdown'] });
      if (variables.sectorData.region_id) {
        queryClient.invalidateQueries({ queryKey: ['sectorsByRegion', variables.sectorData.region_id] });
      }
      toast.success('Sektor uğurla yeniləndi');
    },
    onError: (error: any) => {
      toast.error(`Xəta: ${error.message || 'Sektor yenilənərkən problem baş verdi'}`);
    }
  });

  return mutation;
};

// Sektor silmək üçün hook
export const useDeleteSector = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => sectorsService.deleteSector(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sectors'] });
      queryClient.invalidateQueries({ queryKey: ['sectorsDropdown'] });
      toast.success('Sektor uğurla silindi');
    },
    onError: (error: any) => {
      toast.error(`Xəta: ${error.message || 'Sektor silinərkən problem baş verdi'}`);
    }
  });

  return mutation;
};
