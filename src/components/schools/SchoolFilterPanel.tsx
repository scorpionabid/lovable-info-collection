
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { X } from "lucide-react";
import { SchoolFilter } from '@/services/supabase/school/types';

interface SchoolFilterPanelProps {
  onFilterChange: (filters: SchoolFilter) => void;
  regions: { id: string; name: string }[];
  sectors: { id: string; name: string }[];
  schoolTypes: { id: string; name: string }[];
  isLoading?: boolean;
}

export const SchoolFilterPanel: React.FC<SchoolFilterPanelProps> = ({
  onFilterChange,
  regions,
  sectors,
  schoolTypes,
  isLoading = false
}) => {
  const [filters, setFilters] = React.useState<SchoolFilter>({
    search: '',
    region_id: '',
    sector_id: '',
    type_id: '',
    status: 'all',
    minCompletionRate: 0,
    maxCompletionRate: 100
  });

  // Handle input change for text filters
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Handle select change for dropdown filters
  const handleSelectChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Handle slider change for completion rate
  const handleCompletionRateChange = (values: number[]) => {
    setFilters(prev => ({
      ...prev,
      minCompletionRate: values[0],
      maxCompletionRate: values[1]
    }));
  };

  // Apply filters
  const applyFilters = () => {
    onFilterChange(filters);
  };

  // Reset filters
  const resetFilters = () => {
    const resetFiltersState = {
      search: '',
      region_id: '',
      sector_id: '',
      type_id: '',
      status: 'all' as const,
      minCompletionRate: 0,
      maxCompletionRate: 100
    };
    setFilters(resetFiltersState);
    onFilterChange(resetFiltersState);
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Axtarış</Label>
            <Input
              id="search"
              name="search"
              placeholder="Məktəb adı axtar..."
              value={filters.search}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>
          
          {/* Region Filter */}
          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <Select
              value={filters.region_id}
              onValueChange={(value) => handleSelectChange('region_id', value)}
              disabled={isLoading}
            >
              <SelectTrigger id="region">
                <SelectValue placeholder="Region seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Bütün regionlar</SelectItem>
                {regions.map((region) => (
                  <SelectItem key={region.id} value={region.id}>
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Sector Filter */}
          <div className="space-y-2">
            <Label htmlFor="sector">Sektor</Label>
            <Select
              value={filters.sector_id}
              onValueChange={(value) => handleSelectChange('sector_id', value)}
              disabled={isLoading || !filters.region_id}
            >
              <SelectTrigger id="sector">
                <SelectValue placeholder={filters.region_id ? "Sektor seçin" : "Əvvəlcə region seçin"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Bütün sektorlar</SelectItem>
                {sectors.map((sector) => (
                  <SelectItem key={sector.id} value={sector.id}>
                    {sector.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* School Type Filter */}
          <div className="space-y-2">
            <Label htmlFor="type">Məktəb növü</Label>
            <Select
              value={filters.type_id}
              onValueChange={(value) => handleSelectChange('type_id', value)}
              disabled={isLoading}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Növ seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Bütün növlər</SelectItem>
                {schoolTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Status Filter */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => handleSelectChange('status', value as 'all' | 'active' | 'inactive')}
              disabled={isLoading}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Status seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Bütün</SelectItem>
                <SelectItem value="active">Aktiv</SelectItem>
                <SelectItem value="inactive">Deaktiv</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Completion Rate Filter */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Tamamlanma faizi</Label>
              <span className="text-sm text-gray-500">
                {filters.minCompletionRate}% - {filters.maxCompletionRate}%
              </span>
            </div>
            <Slider
              min={0}
              max={100}
              step={5}
              value={[filters.minCompletionRate, filters.maxCompletionRate]}
              onValueChange={handleCompletionRateChange}
              disabled={isLoading}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={resetFilters}
            disabled={isLoading}
          >
            <X className="w-4 h-4 mr-2" />
            Sıfırla
          </Button>
          <Button 
            onClick={applyFilters}
            disabled={isLoading}
          >
            Tətbiq et
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
