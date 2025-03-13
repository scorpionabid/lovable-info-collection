
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileDown, Plus, Filter } from "lucide-react";

interface UserTableToolbarProps {
  search: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExport: () => void;
  onAddUser: () => void;
  onOpenFilters?: () => void;
}

export const UserTableToolbar: React.FC<UserTableToolbarProps> = ({
  search,
  onSearchChange,
  onExport,
  onAddUser,
  onOpenFilters
}) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
      <div className="flex items-center w-full md:w-auto">
        <Input
          type="text"
          placeholder="Axtar..."
          value={search}
          onChange={onSearchChange}
          className="max-w-md"
        />
        {onOpenFilters && (
          <Button 
            onClick={onOpenFilters} 
            variant="outline" 
            size="icon" 
            className="ml-2"
          >
            <Filter className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
        <Button onClick={onExport} variant="outline" className="whitespace-nowrap">
          <FileDown className="mr-2 h-4 w-4" />
          İxrac et
        </Button>
        <Button onClick={onAddUser} className="whitespace-nowrap">
          <Plus className="mr-2 h-4 w-4" />
          Əlavə et
        </Button>
      </div>
    </div>
  );
};
