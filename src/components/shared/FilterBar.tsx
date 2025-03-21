
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface FilterBarProps {
  onSearch: (query: string) => void;
  searchPlaceholder?: string;
  filterContent?: React.ReactNode;
  showFilterButton?: boolean;
  additionalButtons?: React.ReactNode;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onSearch,
  searchPlaceholder = 'Axtar...',
  filterContent,
  showFilterButton = true,
  additionalButtons
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };
  
  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };
  
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 mb-4">
      <form onSubmit={handleSearch} className="flex-1 w-full">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder={searchPlaceholder}
            className="pl-9 pr-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2.5 top-2.5 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {showFilterButton && filterContent && (
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtrlər
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              {filterContent}
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFilterOpen(false)}
                >
                  Ləğv
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsFilterOpen(false)}
                >
                  Tətbiq et
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}

      {additionalButtons}
    </div>
  );
};
