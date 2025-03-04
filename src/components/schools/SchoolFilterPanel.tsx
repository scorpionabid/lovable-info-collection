
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { SchoolFilter } from "@/services/supabase/schoolService";
import { getRegionsForDropdown } from "@/services/supabase/sector/helperFunctions";

interface SchoolFilterPanelProps {
  isVisible: boolean;
  onToggleVisibility: () => void;
  onApplyFilters: (filters: SchoolFilter) => void;
}

export const SchoolFilterPanel = ({ isVisible, onToggleVisibility, onApplyFilters }: SchoolFilterPanelProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegionId, setSelectedRegionId] = useState<string>('');
  const [selectedSectorId, setSelectedSectorId] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [minRate, setMinRate] = useState<string>('');
  const [maxRate, setMaxRate] = useState<string>('');
  
  const [regions, setRegions] = useState<Array<{id: string, name: string}>>([]);
  const [sectors, setSectors] = useState<Array<{id: string, name: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load regions when component mounts
  useEffect(() => {
    const loadRegions = async () => {
      try {
        setIsLoading(true);
        const data = await getRegionsForDropdown();
        setRegions(data);
      } catch (error) {
        console.error('Error loading regions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRegions();
  }, []);
  
  // Load sectors when a region is selected
  useEffect(() => {
    const loadSectors = async () => {
      if (!selectedRegionId) {
        setSectors([]);
        return;
      }
      
      try {
        setIsLoading(true);
        // This would be replaced with a call to get sectors by region ID
        // For now, using the mock data
        const sectorsMock = [
          { id: '1', name: 'Nəsimi rayonu' },
          { id: '2', name: 'Yasamal rayonu' },
          { id: '3', name: 'Sabunçu rayonu' },
          { id: '4', name: 'Mərkəz' },
        ];
        setSectors(sectorsMock);
      } catch (error) {
        console.error('Error loading sectors:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSectors();
  }, [selectedRegionId]);
  
  const handleReset = () => {
    setSearchTerm('');
    setSelectedRegionId('');
    setSelectedSectorId('');
    setSelectedType('');
    setSelectedStatus('');
    setMinRate('');
    setMaxRate('');
    
    // Apply empty filters to reset the results
    onApplyFilters({});
  };
  
  const handleApplyFilters = () => {
    const filters: SchoolFilter = {};
    
    if (searchTerm) filters.search = searchTerm;
    if (selectedRegionId) filters.regionId = selectedRegionId;
    if (selectedSectorId) filters.sectorId = selectedSectorId;
    if (selectedType) filters.type = selectedType;
    if (selectedStatus) filters.status = selectedStatus;
    if (minRate) filters.minCompletionRate = parseInt(minRate);
    if (maxRate) filters.maxCompletionRate = parseInt(maxRate);
    
    onApplyFilters(filters);
  };
  
  if (!isVisible) {
    return (
      <div className="lg:col-span-1 flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onToggleVisibility}
          className="h-8 w-8 p-0 rounded-full"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }
  
  return (
    <div className="lg:col-span-3 bg-white p-4 rounded-lg shadow-sm h-fit">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-infoline-dark-blue">Filterlər</h3>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleReset}
            className="h-8 text-infoline-dark-gray"
          >
            <X className="h-4 w-4 mr-1" />
            Sıfırla
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleVisibility}
            className="h-8 w-8 p-0 lg:flex hidden"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-infoline-dark-gray mb-1 block">
            Axtarış
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-infoline-gray" />
            <Input
              placeholder="Məktəb adı, direktor..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-infoline-dark-gray mb-1 block">
            Region
          </label>
          <Select value={selectedRegionId} onValueChange={setSelectedRegionId}>
            <SelectTrigger>
              <SelectValue placeholder="Bütün regionlar" />
            </SelectTrigger>
            <SelectContent>
              {regions.map(region => (
                <SelectItem key={region.id} value={region.id}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium text-infoline-dark-gray mb-1 block">
            Sektor
          </label>
          <Select 
            value={selectedSectorId} 
            onValueChange={setSelectedSectorId}
            disabled={!selectedRegionId || sectors.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Bütün sektorlar" />
            </SelectTrigger>
            <SelectContent>
              {sectors.map(sector => (
                <SelectItem key={sector.id} value={sector.id}>
                  {sector.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium text-infoline-dark-gray mb-1 block">
            Məktəb növü
          </label>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="Bütün növlər" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Orta məktəb">Orta məktəb</SelectItem>
              <SelectItem value="Tam orta məktəb">Tam orta məktəb</SelectItem>
              <SelectItem value="İbtidai məktəb">İbtidai məktəb</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium text-infoline-dark-gray mb-1 block">
            Status
          </label>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Bütün statuslar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Aktiv">Aktiv</SelectItem>
              <SelectItem value="Deaktiv">Deaktiv</SelectItem>
              <SelectItem value="Arxivləşdirilmiş">Arxivləşdirilmiş</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium text-infoline-dark-gray mb-1 block">
            Doldurma faizi
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Select value={minRate} onValueChange={setMinRate}>
              <SelectTrigger>
                <SelectValue placeholder="Min" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0%</SelectItem>
                <SelectItem value="25">25%</SelectItem>
                <SelectItem value="50">50%</SelectItem>
                <SelectItem value="75">75%</SelectItem>
              </SelectContent>
            </Select>
            <Select value={maxRate} onValueChange={setMaxRate}>
              <SelectTrigger>
                <SelectValue placeholder="Max" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25%</SelectItem>
                <SelectItem value="50">50%</SelectItem>
                <SelectItem value="75">75%</SelectItem>
                <SelectItem value="100">100%</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="pt-2">
          <Button 
            className="w-full bg-infoline-blue hover:bg-infoline-dark-blue"
            onClick={handleApplyFilters}
          >
            Tətbiq et
          </Button>
        </div>
      </div>
    </div>
  );
};
