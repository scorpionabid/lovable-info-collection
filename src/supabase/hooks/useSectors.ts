
/**
 * Sektorlar üçün hook
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as sectorsService from "../services/sectors";

// Bütün sektorları almaq üçün hook
export const useSectors = (
  pagination?: sectorsService.PaginationParams,
  sort?: sectorsService.SortParams,
  filters?: sectorsService.SectorFilters
) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['sectors', pagination, sort, filters],
    queryFn: () => sectorsService.getSectors(pagination, sort, filters),
    keepPreviousData: true
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
    enabled: !!id
  });

  return {
    sector: data,
    isLoading,
    error
  };
};

// Region ID ilə sektorları almaq üçün hook
export const useSectorsByRegion = (regionId?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['sectorsByRegion', regionId],
    queryFn: () => sectorsService.getSectorsByRegionId(regionId),
    enabled: !!regionId
  });

  return {
    sectors: data || [],
    isLoading,
    error
  };
};

// Dropdown üçün sektorları almaq
export const useSectorsDropdown = (regionId?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['sectorsDropdown', regionId],
    queryFn: () => sectorsService.getSectorsForDropdown(regionId),
    enabled: true // RegionId olmasa da bütün sektorları gətirə bilər
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
    mutationFn: (sectorData: Partial<sectorsService.Sector>) => 
      sectorsService.createSector(sectorData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['sectors']);
      queryClient.invalidateQueries(['sectorsByRegion', variables.region_id]);
      queryClient.invalidateQueries(['sectorsDropdown']);
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
    mutationFn: ({ id, sectorData }: { id: string; sectorData: Partial<sectorsService.Sector> }) => 
      sectorsService.updateSector(id, sectorData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['sectors']);
      queryClient.invalidateQueries(['sector', variables.id]);
      queryClient.invalidateQueries(['sectorsByRegion', variables.sectorData.region_id]);
      queryClient.invalidateQueries(['sectorsDropdown']);
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
      queryClient.invalidateQueries(['sectors']);
      queryClient.invalidateQueries(['sectorsDropdown']);
      toast.success('Sektor uğurla silindi');
    },
    onError: (error: any) => {
      toast.error(`Xəta: ${error.message || 'Sektor silinərkən problem baş verdi'}`);
    }
  });

  return mutation;
};

// Sektor arxivləşdirmək üçün hook
export const useArchiveSector = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, archive }: { id: string; archive: boolean }) => 
      sectorsService.archiveSector(id, archive),
    onSuccess: () => {
      queryClient.invalidateQueries(['sectors']);
      queryClient.invalidateQueries(['sectorsDropdown']);
      toast.success('Sektor statusu uğurla dəyişdirildi');
    },
    onError: (error: any) => {
      toast.error(`Xəta: ${error.message || 'Sektor statusu dəyişdirilərkən problem baş verdi'}`);
    }
  });

  return mutation;
};
