
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterParams } from "@/services/supabase/sector/types";
import { useToast } from '@/hooks/use-toast';
import { DatePicker } from "@/components/ui/date-picker";

interface SectorFilterPanelProps {
  onApplyFilters: (filters: FilterParams) => void;
  onClose: () => void;
  initialFilters?: FilterParams;
}

export const SectorFilterPanel: React.FC<SectorFilterPanelProps> = ({ onApplyFilters, onClose, initialFilters = {} }) => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<FilterParams>({
    search: initialFilters.search || '',
    region_id: initialFilters.region_id || '',
    status: initialFilters.status || 'all',
    min_completion_rate: initialFilters.min_completion_rate || undefined,
    max_completion_rate: initialFilters.max_completion_rate || undefined,
    searchQuery: initialFilters.searchQuery || '',
    dateFrom: initialFilters.dateFrom || '',
    dateTo: initialFilters.dateTo || '',
    completionRate: initialFilters.completionRate || 'all',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      search: '',
      region_id: '',
      status: 'all',
      min_completion_rate: undefined,
      max_completion_rate: undefined,
      searchQuery: '',
      dateFrom: '',
      dateTo: '',
      completionRate: 'all',
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Filtrlər</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          ✕
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="searchQuery">Axtarış</Label>
          <Input
            id="searchQuery"
            name="searchQuery"
            placeholder="Axtarış..."
            value={filters.searchQuery || ''}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="region_id">Region</Label>
          <Select
            value={filters.region_id || ''}
            onValueChange={(value) => handleSelectChange('region_id', value)}
          >
            <SelectTrigger id="region_id">
              <SelectValue placeholder="Bütün regionlar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Bütün regionlar</SelectItem>
              <SelectItem value="1">Bakı</SelectItem>
              <SelectItem value="2">Sumqayıt</SelectItem>
              <SelectItem value="3">Gəncə</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={filters.status || 'all'}
            onValueChange={(value) => handleSelectChange('status', value as 'active' | 'inactive' | 'all')}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Bütün statuslar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Bütün statuslar</SelectItem>
              <SelectItem value="active">Aktiv</SelectItem>
              <SelectItem value="inactive">Deaktiv</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="completionRate">Doldurulma faizi</Label>
          <Select
            value={filters.completionRate || 'all'}
            onValueChange={(value) => handleSelectChange('completionRate', value)}
          >
            <SelectTrigger id="completionRate">
              <SelectValue placeholder="Bütün" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Bütün</SelectItem>
              <SelectItem value="0-25">0% - 25%</SelectItem>
              <SelectItem value="25-50">25% - 50%</SelectItem>
              <SelectItem value="50-75">50% - 75%</SelectItem>
              <SelectItem value="75-100">75% - 100%</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="outline" onClick={handleReset}>
          Sıfırla
        </Button>
        <Button onClick={handleApply}>
          Tətbiq et
        </Button>
      </div>
    </div>
  );
};
