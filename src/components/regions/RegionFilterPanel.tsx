
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { FilterParams } from '@/supabase/types'; // Updated import

interface RegionFilterPanelProps {
  filters: FilterParams; // Using FilterParams instead of RegionFilters
  onFilterChange: (name: string, value: any) => void;
  onResetFilters: () => void;
}

export const RegionFilterPanel: React.FC<RegionFilterPanelProps> = ({
  filters,
  onFilterChange,
  onResetFilters
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange('search', e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Trigger search on enter if needed
    }
  };

  const hasActiveFilters = !!filters.search;

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative flex w-full md:max-w-sm">
        <Input
          placeholder="Search regions..."
          value={filters.search || ''}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          className="pr-10"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
      </div>
      {hasActiveFilters && (
        <Button
          variant="ghost"
          onClick={onResetFilters}
          className="flex items-center text-xs"
        >
          <X className="mr-1 h-4 w-4" />
          Reset filters
        </Button>
      )}
    </div>
  );
};

export default RegionFilterPanel;
