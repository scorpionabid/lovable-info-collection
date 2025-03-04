
import React from "react";
import { Search, Filter, Upload, Download, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UserHeaderProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleFilters: () => void;
  onImportUsers: () => void;
  onExportUsers: () => void;
  onCreateUser: () => void;
  isLoading: boolean;
}

export const UserHeader = ({
  searchTerm,
  onSearchChange,
  onToggleFilters,
  onImportUsers,
  onExportUsers,
  onCreateUser,
  isLoading
}: UserHeaderProps) => {
  return (
    <div className="flex flex-wrap gap-3 items-center justify-between bg-white p-4 rounded-lg shadow-sm">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-infoline-dark-gray" />
          <Input
            placeholder="İstifadəçi axtar..."
            className="pl-9 border-infoline-light-gray"
            value={searchTerm}
            onChange={onSearchChange}
          />
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onToggleFilters}
          className="flex items-center gap-1"
        >
          <Filter size={16} />
          <span>Filtrlər</span>
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onImportUsers}
          className="flex items-center gap-1"
        >
          <Upload size={16} />
          <span>İdxal et</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onExportUsers}
          className="flex items-center gap-1"
        >
          <Download size={16} />
          <span>İxrac et</span>
        </Button>
        <Button 
          onClick={onCreateUser}
          size="sm" 
          className="flex items-center gap-1 bg-infoline-blue hover:bg-infoline-dark-blue"
          disabled={isLoading}
        >
          <UserPlus size={16} />
          <span>Yeni istifadəçi</span>
        </Button>
      </div>
    </div>
  );
};
