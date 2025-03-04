
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, X } from "lucide-react";
import userService, { UserFilters } from "@/services/api/userService";

interface UserFilterPanelProps {
  onClose: () => void;
  onApplyFilters: (filters: UserFilters) => void;
  currentFilters?: UserFilters;
}

export const UserFilterPanel = ({ onClose, onApplyFilters, currentFilters = {} }: UserFilterPanelProps) => {
  const [filters, setFilters] = useState<UserFilters>(currentFilters);
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>(currentFilters.region_id);
  const [selectedSector, setSelectedSector] = useState<string | undefined>(currentFilters.sector_id);

  // Fetch filter data
  const { data: roles = [], isLoading: isLoadingRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: () => userService.getRoles(),
  });

  const { data: regions = [], isLoading: isLoadingRegions } = useQuery({
    queryKey: ['regions'],
    queryFn: () => userService.getRegions(),
  });
  
  const { data: sectors = [], isLoading: isLoadingSectors } = useQuery({
    queryKey: ['sectors', selectedRegion],
    queryFn: () => userService.getSectors(selectedRegion),
    enabled: !!selectedRegion,
  });

  const { data: schools = [], isLoading: isLoadingSchools } = useQuery({
    queryKey: ['schools', selectedSector],
    queryFn: () => userService.getSchools(selectedSector),
    enabled: !!selectedSector,
  });

  // Handle region change
  useEffect(() => {
    if (selectedRegion !== filters.region_id) {
      // Reset sector and school if region changes
      setFilters(prev => ({
        ...prev,
        region_id: selectedRegion,
        sector_id: undefined,
        school_id: undefined
      }));
      setSelectedSector(undefined);
    }
  }, [selectedRegion]);

  // Handle sector change
  useEffect(() => {
    if (selectedSector !== filters.sector_id) {
      // Reset school if sector changes
      setFilters(prev => ({
        ...prev,
        sector_id: selectedSector,
        school_id: undefined
      }));
    }
  }, [selectedSector]);

  const handleInputChange = (field: keyof UserFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    setFilters({});
    setSelectedRegion(undefined);
    setSelectedSector(undefined);
  };

  const isLoading = isLoadingRoles || isLoadingRegions || isLoadingSectors || isLoadingSchools;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm animate-scale-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-infoline-dark-blue">Ətraflı Filtrlər</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {isLoading && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-infoline-blue" />
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-sm font-medium text-infoline-dark-gray">
            Ad
          </label>
          <Input 
            id="firstName" 
            placeholder="Ad axtar..." 
            value={filters.search || ''}
            onChange={(e) => handleInputChange('search', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="role" className="text-sm font-medium text-infoline-dark-gray">
            Rol
          </label>
          <Select 
            value={filters.role} 
            onValueChange={(value) => handleInputChange('role', value === 'all' ? undefined : value)}
          >
            <SelectTrigger id="role">
              <SelectValue placeholder="Bütün rollar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Bütün rollar</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.name}>
                  {role.name === 'superadmin' || role.name === 'super-admin' 
                    ? 'SuperAdmin' 
                    : role.name === 'region-admin'
                    ? 'Region Admin'
                    : role.name === 'sector-admin'
                    ? 'Sektor Admin'
                    : role.name === 'school-admin'
                    ? 'Məktəb Admin'
                    : role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="region" className="text-sm font-medium text-infoline-dark-gray">
            Region
          </label>
          <Select 
            value={selectedRegion} 
            onValueChange={(value) => setSelectedRegion(value === 'all' ? undefined : value)}
          >
            <SelectTrigger id="region">
              <SelectValue placeholder="Bütün regionlar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Bütün regionlar</SelectItem>
              {regions.map((region) => (
                <SelectItem key={region.id} value={region.id}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="sector" className="text-sm font-medium text-infoline-dark-gray">
            Sektor
          </label>
          <Select 
            value={selectedSector} 
            onValueChange={(value) => setSelectedSector(value === 'all' ? undefined : value)}
            disabled={!selectedRegion || sectors.length === 0}
          >
            <SelectTrigger id="sector">
              <SelectValue placeholder="Bütün sektorlar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Bütün sektorlar</SelectItem>
              {sectors.map((sector) => (
                <SelectItem key={sector.id} value={sector.id}>
                  {sector.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="school" className="text-sm font-medium text-infoline-dark-gray">
            Məktəb
          </label>
          <Select 
            value={filters.school_id} 
            onValueChange={(value) => handleInputChange('school_id', value === 'all' ? undefined : value)}
            disabled={!selectedSector || schools.length === 0}
          >
            <SelectTrigger id="school">
              <SelectValue placeholder="Bütün məktəblər" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Bütün məktəblər</SelectItem>
              {schools.map((school) => (
                <SelectItem key={school.id} value={school.id}>
                  {school.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium text-infoline-dark-gray">
            Status
          </label>
          <Select 
            value={filters.status} 
            onValueChange={(value) => handleInputChange('status', value === 'all' ? undefined : value as 'active' | 'inactive' | 'blocked')}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Bütün statuslar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Bütün statuslar</SelectItem>
              <SelectItem value="active">Aktiv</SelectItem>
              <SelectItem value="inactive">Qeyri-aktiv</SelectItem>
              <SelectItem value="blocked">Bloklanmış</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={handleReset}>Sıfırla</Button>
        <Button variant="outline" onClick={onClose}>Ləğv et</Button>
        <Button className="bg-infoline-blue hover:bg-infoline-dark-blue" onClick={handleApply}>Tətbiq et</Button>
      </div>
    </div>
  );
};
