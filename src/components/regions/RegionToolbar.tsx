
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Filter, RefreshCcw, Download, Upload } from 'lucide-react';

export interface RegionToolbarProps {
  onCreateClick: () => void;
  onToggleFilterPanel: () => void;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  onExport?: () => void;
  onImport?: () => void;
  onRefresh?: () => void;
}

export const RegionToolbar: React.FC<RegionToolbarProps> = ({
  onCreateClick,
  onToggleFilterPanel,
  searchQuery = '',
  onSearchChange,
  onExport,
  onImport,
  onRefresh
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 p-4 bg-white rounded-lg shadow">
      {onSearchChange && (
        <div className="relative flex-1">
          <Input
            placeholder="Axtarış..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={onToggleFilterPanel}
        >
          <Filter size={16} />
          Filtrlər
        </Button>
        
        {onRefresh && (
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={onRefresh}
          >
            <RefreshCcw size={16} />
            Yenilə
          </Button>
        )}
        
        {onExport && (
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={onExport}
          >
            <Download size={16} />
            İxrac et
          </Button>
        )}
        
        {onImport && (
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={onImport}
          >
            <Upload size={16} />
            İdxal et
          </Button>
        )}
        
        <Button 
          className="bg-infoline-blue hover:bg-infoline-dark-blue flex items-center gap-2"
          onClick={onCreateClick}
        >
          <Plus size={16} />
          Yeni Region
        </Button>
      </div>
    </div>
  );
};

export default RegionToolbar;
