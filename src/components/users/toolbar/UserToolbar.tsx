
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, UserPlus, FilterIcon, Download, Loader2 } from 'lucide-react';

interface UserToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onAddUser: () => void;
  onExportUsers: () => void;
  onOpenFilters: () => void;
  isExporting: boolean;
}

export const UserToolbar: React.FC<UserToolbarProps> = ({
  searchValue,
  onSearchChange,
  onAddUser,
  onExportUsers,
  onOpenFilters,
  isExporting
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div className="relative w-full md:w-auto flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type="search"
          placeholder="İstifadəçiləri axtar..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 py-2 w-full"
        />
      </div>
      
      <div className="flex items-center gap-2 w-full md:w-auto">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onOpenFilters}
          className="flex items-center gap-1"
        >
          <FilterIcon size={16} />
          <span className="hidden sm:inline">Filtrlər</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onExportUsers}
          disabled={isExporting}
          className="flex items-center gap-1"
        >
          {isExporting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Download size={16} />
          )}
          <span className="hidden sm:inline">Eksport</span>
        </Button>
        
        <Button 
          variant="default" 
          size="sm" 
          onClick={onAddUser}
          className="flex items-center gap-1"
        >
          <UserPlus size={16} />
          <span>Əlavə et</span>
        </Button>
      </div>
    </div>
  );
};
