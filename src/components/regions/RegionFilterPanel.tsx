
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { RegionFilters } from '@/supabase/types';

export interface RegionFilterPanelProps {
  filters: {
    search: string;
    status: 'active' | 'inactive' | 'all';
  };
  onFilterChange: (key: string, value: any) => void;
  onFiltersChange: React.Dispatch<React.SetStateAction<{
    search: string;
    status: 'active' | 'inactive' | 'all';
  }>>;
  onFilterApply: () => void;
}

export const RegionFilterPanel: React.FC<RegionFilterPanelProps> = ({ 
  filters, 
  onFilterChange, 
  onFiltersChange,
  onFilterApply 
}) => {
  // Use a local copy of filters to avoid immediate re-renders
  const [localFilters, setLocalFilters] = React.useState(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleStatusChange = (value: string) => {
    setLocalFilters(prev => ({ ...prev, status: value as 'active' | 'inactive' | 'all' }));
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onFilterApply();
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      status: 'active' as const
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
    onFilterApply();
  };

  return (
    <div className="bg-white p-4 rounded-md border border-infoline-light-gray mb-4">
      <div className="space-y-4">
        <div>
          <Label className="text-infoline-dark-blue font-medium">Status</Label>
          <RadioGroup value={localFilters.status} onValueChange={handleStatusChange} className="mt-2">
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="active" id="active" />
                <Label htmlFor="active" className="cursor-pointer">Aktiv</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inactive" id="inactive" />
                <Label htmlFor="inactive" className="cursor-pointer">Deaktiv</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="cursor-pointer">Hamısı</Label>
              </div>
            </div>
          </RadioGroup>
        </div>
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
          >
            Sıfırla
          </Button>
          <Button
            size="sm"
            onClick={handleApply}
          >
            Tətbiq et
          </Button>
        </div>
      </div>
    </div>
  );
};
