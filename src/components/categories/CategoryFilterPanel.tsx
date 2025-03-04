
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { CategoryFilter } from '@/services/supabase/categoryService';

interface CategoryFilterPanelProps {
  onClose: () => void;
  onApplyFilters: (filters: CategoryFilter) => void;
  initialFilters?: CategoryFilter;
}

export const CategoryFilterPanel = ({ onClose, onApplyFilters, initialFilters = {} }: CategoryFilterPanelProps) => {
  const [filters, setFilters] = useState<CategoryFilter>({
    assignment: initialFilters.assignment,
    status: initialFilters.status,
    deadlineBefore: initialFilters.deadlineBefore,
    deadlineAfter: initialFilters.deadlineAfter,
    minCompletionRate: initialFilters.minCompletionRate,
    maxCompletionRate: initialFilters.maxCompletionRate
  });
  
  // Handling completion rate checkboxes
  const [completionRates, setCompletionRates] = useState({
    high: initialFilters.minCompletionRate === 80,
    medium: initialFilters.minCompletionRate === 50 && initialFilters.maxCompletionRate === 80,
    low: initialFilters.maxCompletionRate === 50
  });

  // Update filters when completion rate checkboxes change
  useEffect(() => {
    const newFilters = { ...filters };
    
    if (completionRates.high) {
      newFilters.minCompletionRate = 80;
      newFilters.maxCompletionRate = undefined;
    } else if (completionRates.medium) {
      newFilters.minCompletionRate = 50;
      newFilters.maxCompletionRate = 80;
    } else if (completionRates.low) {
      newFilters.minCompletionRate = undefined;
      newFilters.maxCompletionRate = 50;
    } else {
      newFilters.minCompletionRate = undefined;
      newFilters.maxCompletionRate = undefined;
    }
    
    setFilters(newFilters);
  }, [completionRates]);

  const handleCompletionRateChange = (rate: 'high' | 'medium' | 'low', checked: boolean) => {
    setCompletionRates({
      high: rate === 'high' ? checked : false,
      medium: rate === 'medium' ? checked : false,
      low: rate === 'low' ? checked : false
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string | undefined) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFilters({});
    setCompletionRates({ high: false, medium: false, low: false });
  };

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
          <label htmlFor="name" className="text-sm font-medium text-infoline-dark-gray">
            Kateqoriya adı
          </label>
          <Input 
            id="name" 
            name="search" 
            value={filters.search || ''} 
            onChange={handleInputChange} 
            placeholder="Kateqoriya adı axtar..." 
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="assignment" className="text-sm font-medium text-infoline-dark-gray">
            Təyinat
          </label>
          <Select 
            value={filters.assignment} 
            onValueChange={(value) => handleSelectChange('assignment', value || undefined)}
          >
            <SelectTrigger id="assignment">
              <SelectValue placeholder="Bütün təyinatlar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Bütün təyinatlar</SelectItem>
              <SelectItem value="All">Bütün məktəblər (All)</SelectItem>
              <SelectItem value="Sectors">Yalnız sektorlar (Sectors)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium text-infoline-dark-gray">
            Status
          </label>
          <Select 
            value={filters.status} 
            onValueChange={(value) => handleSelectChange('status', value || undefined)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Bütün statuslar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Bütün statuslar</SelectItem>
              <SelectItem value="Active">Aktiv</SelectItem>
              <SelectItem value="Inactive">Deaktiv</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="deadlineBefore" className="text-sm font-medium text-infoline-dark-gray">
            Son tarix (əvvəl)
          </label>
          <Input 
            id="deadlineBefore" 
            name="deadlineBefore" 
            type="date" 
            value={filters.deadlineBefore || ''} 
            onChange={handleInputChange} 
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="deadlineAfter" className="text-sm font-medium text-infoline-dark-gray">
            Son tarix (sonra)
          </label>
          <Input 
            id="deadlineAfter" 
            name="deadlineAfter" 
            type="date" 
            value={filters.deadlineAfter || ''} 
            onChange={handleInputChange} 
          />
        </div>
      </div>
      
      <div className="mt-4 border-t pt-4 border-infoline-light-gray">
        <h4 className="text-sm font-medium text-infoline-dark-blue mb-2">Doldurma faizi</h4>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="completion-high" 
              checked={completionRates.high}
              onCheckedChange={(checked) => handleCompletionRateChange('high', !!checked)}
            />
            <Label htmlFor="completion-high" className="text-sm">Yüksək (&gt;80%)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="completion-medium" 
              checked={completionRates.medium}
              onCheckedChange={(checked) => handleCompletionRateChange('medium', !!checked)}
            />
            <Label htmlFor="completion-medium" className="text-sm">Orta (50-80%)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="completion-low" 
              checked={completionRates.low}
              onCheckedChange={(checked) => handleCompletionRateChange('low', !!checked)}
            />
            <Label htmlFor="completion-low" className="text-sm">Aşağı (&lt;50%)</Label>
          </div>
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
