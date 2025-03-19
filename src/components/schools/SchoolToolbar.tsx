
import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SchoolToolbarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRefresh: () => void;
  onExport: () => void;
  onImport: () => void;
  onCreateSchool: () => void;
  onToggleFilters: () => void;
}

export const SchoolToolbar: React.FC<SchoolToolbarProps> = ({
  searchQuery,
  onSearchChange,
  onRefresh,
  onExport,
  onImport,
  onCreateSchool,
  onToggleFilters
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
        <Input
          type="search"
          placeholder="Məktəb axtar..."
          className="pl-8 bg-white dark:bg-gray-950"
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>
      
      <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onToggleFilters}
        >
          Filtrlər
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRefresh}
        >
          Yenilə
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={onExport}
        >
          Export
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={onImport}
        >
          Import
        </Button>
        
        <Button 
          size="sm"
          onClick={onCreateSchool}
        >
          Yeni Məktəb
        </Button>
      </div>
    </div>
  );
};
