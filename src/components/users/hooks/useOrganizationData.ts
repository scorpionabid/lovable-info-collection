
import { useQuery } from "@tanstack/react-query";
import userService from "@/services/userService";

export const useOrganizationData = (
  currentUserId?: string,
  currentUserRole?: string,
  selectedRegion: string = "",
  selectedSector: string = ""
) => {
  // Fetch data for dropdowns
  const { data: roles = [], isLoading: isLoadingRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: () => userService.getRoles(),
  });

  const { data: regions = [], isLoading: isLoadingRegions } = useQuery({
    queryKey: ['regions', currentUserId, currentUserRole],
    queryFn: () => userService.getRegions(currentUserId, currentUserRole),
  });
  
  const { data: sectors = [], isLoading: isLoadingSectors } = useQuery({
    queryKey: ['sectors', selectedRegion, currentUserId, currentUserRole],
    queryFn: () => userService.getSectors(selectedRegion, currentUserId, currentUserRole),
    enabled: !!selectedRegion || !!currentUserId,
  });

  const { data: schools = [], isLoading: isLoadingSchools } = useQuery({
    queryKey: ['schools', selectedSector, currentUserId, currentUserRole],
    queryFn: () => userService.getSchools(selectedSector, currentUserId, currentUserRole),
    enabled: !!selectedSector || !!currentUserId,
  });

  const isLoading = isLoadingRoles || isLoadingRegions || isLoadingSectors || isLoadingSchools;

  // Find role details
  const getRoleById = (roleId: string) => {
    return roles.find(role => role.id === roleId);
  };

  return {
    roles,
    regions,
    sectors,
    schools,
    isLoading,
    getRoleById
  };
};
