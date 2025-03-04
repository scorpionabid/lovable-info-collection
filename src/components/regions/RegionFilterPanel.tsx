
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { FilterParams } from "@/services/supabase/regionService";

interface RegionFilterPanelProps {
  onClose: () => void;
  onApplyFilters: (filters: FilterParams) => void;
  initialFilters: FilterParams;
}

export const RegionFilterPanel = ({ onClose, onApplyFilters, initialFilters }: RegionFilterPanelProps) => {
  const [filters, setFilters] = useState<FilterParams>(initialFilters);

  // Initialize filter values from props
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Reset filters
  const handleReset = () => {
    setFilters({
      searchQuery: '',
      dateFrom: '',
      dateTo: '',
      completionRate: 'all'
    });
  };

  // Apply filters
  const handleApply = () => {
    onApplyFilters(filters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm animate-scale-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-infoline-dark-blue">Ətraflı Filtrlər</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label htmlFor="searchQuery" className="text-sm font-medium text-infoline-dark-gray">
            Region adı
          </label>
          <Input 
            id="searchQuery" 
            name="searchQuery"
            value={filters.searchQuery || ''}
            onChange={handleInputChange}
            placeholder="Region adı axtar..." 
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="dateFrom" className="text-sm font-medium text-infoline-dark-gray">
            Tarixdən
          </label>
          <Input 
            id="dateFrom" 
            name="dateFrom"
            value={filters.dateFrom || ''}
            onChange={handleInputChange}
            type="date" 
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="dateTo" className="text-sm font-medium text-infoline-dark-gray">
            Tarixə qədər
          </label>
          <Input 
            id="dateTo" 
            name="dateTo"
            value={filters.dateTo || ''}
            onChange={handleInputChange}
            type="date" 
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="completionRate" className="text-sm font-medium text-infoline-dark-gray">
            Doldurma faizi
          </label>
          <Select 
            value={filters.completionRate || 'all'} 
            onValueChange={(value) => handleSelectChange('completionRate', value)}
          >
            <SelectTrigger id="completionRate">
              <SelectValue placeholder="Bütün faizlər" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Bütün faizlər</SelectItem>
              <SelectItem value="high">Yüksək (&gt;80%)</SelectItem>
              <SelectItem value="medium">Orta (50-80%)</SelectItem>
              <SelectItem value="low">Aşağı (&lt;50%)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={handleReset}>Sıfırla</Button>
        <Button variant="outline" onClick={onClose}>Ləğv et</Button>
        <Button className="bg-infoline-blue hover:bg-infoline-dark-blue" onClick={handleApply}>Tətbiq et</Button>
      </div>
    </div>
  );
};
