
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FilterParams } from '@/lib/supabase/types';

export interface RegionFilterPanelProps {
  filters: FilterParams;
  onFilterChange: (key: string, value: any) => void;
  onFilterApply: () => Promise<void>;
  onFiltersReset?: () => void;
}

export const RegionFilterPanel: React.FC<RegionFilterPanelProps> = ({
  filters,
  onFilterChange,
  onFilterApply,
  onFiltersReset
}) => {
  const handleFilterChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange(key, e.target.value);
  };

  const handleSelectChange = (key: string) => (value: string) => {
    onFilterChange(key, value);
  };

  const handleApplyFilters = async () => {
    await onFilterApply();
  };

  const handleResetFilters = () => {
    if (onFiltersReset) {
      onFiltersReset();
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm space-y-4">
      <h3 className="text-lg font-medium mb-4">Filter Regions</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search by name or code..."
            value={filters.search || ''}
            onChange={handleFilterChange('search')}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="status">Status</Label>
          <Select 
            value={filters.status || 'all'} 
            onValueChange={handleSelectChange('status')}
          >
            <SelectTrigger id="status" className="w-full mt-1">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={handleResetFilters} className="flex-1">
            Reset
          </Button>
          <Button onClick={handleApplyFilters} className="flex-1">
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegionFilterPanel;
