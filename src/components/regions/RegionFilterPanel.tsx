
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Slider 
} from '@/components/ui/slider';

export interface RegionFilterPanelProps {
  onApplyFilters: (filters: any) => void;
  onClose: () => void;
  initialFilters?: any;
}

export const RegionFilterPanel: React.FC<RegionFilterPanelProps> = ({
  onApplyFilters,
  onClose,
  initialFilters = {}
}) => {
  const [filters, setFilters] = useState({
    search: initialFilters.search || '',
    status: initialFilters.status || 'all',
    dateFrom: initialFilters.dateFrom || '',
    dateTo: initialFilters.dateTo || '',
    minCompletionRate: initialFilters.minCompletionRate || 0,
    maxCompletionRate: initialFilters.maxCompletionRate || 100,
  });

  const handleChange = (field: string, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyFilters(filters);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-4">
      <h3 className="text-lg font-medium mb-4">Filtr Parametrləri</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="search">Axtarış</Label>
            <Input 
              id="search"
              placeholder="Region adı..."
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="status">Status</Label>
            <Select 
              value={filters.status}
              onValueChange={(value) => handleChange('status', value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Status seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Hamısı</SelectItem>
                <SelectItem value="active">Aktiv</SelectItem>
                <SelectItem value="inactive">Deaktiv</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="dateFrom">Tarixdən</Label>
            <Input 
              id="dateFrom"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleChange('dateFrom', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="dateTo">Tarixə qədər</Label>
            <Input 
              id="dateTo"
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleChange('dateTo', e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <Label>Tamamlanma faizi ({filters.minCompletionRate}% - {filters.maxCompletionRate}%)</Label>
          <div className="pt-4 px-2">
            <Slider 
              value={[filters.minCompletionRate, filters.maxCompletionRate]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => {
                handleChange('minCompletionRate', value[0]);
                handleChange('maxCompletionRate', value[1]);
              }}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>Ləğv et</Button>
          <Button type="submit">Tətbiq et</Button>
        </div>
      </form>
    </div>
  );
};

export default RegionFilterPanel;
