
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, FileDown, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface RegionToolbarProps {
  onAddRegion: () => void;
  onExportRegions: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onOpenFilters: () => void;
}

export const RegionToolbar: React.FC<RegionToolbarProps> = ({
  onAddRegion,
  onExportRegions,
  searchValue,
  onSearchChange,
  onOpenFilters
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
      <div className="flex items-center w-full sm:w-auto space-x-2">
        <Button onClick={onAddRegion} className="bg-infoline-dark-blue">
          <Plus className="mr-2 h-4 w-4" />
          Yeni Region
        </Button>
        <Button onClick={onExportRegions} variant="outline">
          <FileDown className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
      
      <div className="flex items-center space-x-2 w-full sm:w-auto">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Axtarış..."
            className="pl-8"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Button onClick={onOpenFilters} variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default RegionToolbar;
