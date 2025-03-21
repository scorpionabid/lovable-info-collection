
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

export interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: any) => void;
  onSearch: () => void;
  filterCount: number;
  onClearAll: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchValue,
  onSearchChange,
  onSearch,
  filterCount,
  onClearAll
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
      <div className="relative w-full sm:w-auto sm:min-w-[300px]">
        <Input
          placeholder="Axtar..."
          value={searchValue}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          className="pl-8"
        />
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-infoline-dark-gray" />
        {searchValue && (
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={() => {
              onSearchChange('');
              onSearch();
            }}
          >
            <X className="h-4 w-4 text-infoline-dark-gray" />
          </button>
        )}
      </div>
      
      {filterCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-infoline-blue hover:text-infoline-dark-blue"
        >
          Bütün filtrləri təmizlə ({filterCount})
        </Button>
      )}
    </div>
  );
};
