
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
import { FilterParams } from "@/services/supabase/region";
import { useToast } from "@/hooks/use-toast";

interface RegionFilterPanelProps {
  filters: FilterParams;
  onApplyFilters: (filters: FilterParams) => void;
  onClose: () => void;
}

export const RegionFilterPanel = ({ onClose, onApplyFilters, filters: initialFilters }: RegionFilterPanelProps) => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<FilterParams>(initialFilters);
  const [isValidDate, setIsValidDate] = useState({
    from: true,
    to: true
  });

  // Initialize filter values from props
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    
    // Validate dates
    if (name === 'dateFrom' || name === 'dateTo') {
      validateDates(name, value);
    }
  };

  // Validate date ranges
  const validateDates = (fieldName: string, value: string) => {
    if (!value) {
      setIsValidDate(prev => ({ ...prev, [fieldName === 'dateFrom' ? 'from' : 'to']: true }));
      return;
    }
    
    const dateFrom = fieldName === 'dateFrom' ? value : filters.dateFrom;
    const dateTo = fieldName === 'dateTo' ? value : filters.dateTo;
    
    if (dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)) {
      setIsValidDate({
        from: fieldName === 'dateTo',
        to: fieldName === 'dateFrom'
      });
      return;
    }
    
    setIsValidDate(prev => ({ 
      ...prev, 
      [fieldName === 'dateFrom' ? 'from' : 'to']: true 
    }));
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
    setIsValidDate({ from: true, to: true });
  };

  // Apply filters
  const handleApply = () => {
    // Check date validity
    if (!isValidDate.from || !isValidDate.to) {
      toast({
        title: "Tarix xətası",
        description: "Başlanğıc tarixi son tarixdən böyük ola bilməz",
        variant: "destructive"
      });
      return;
    }
    
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
            className={!isValidDate.from ? "border-red-500" : ""}
          />
          {!isValidDate.from && (
            <p className="text-xs text-red-500">Başlanğıc tarixi son tarixdən böyük ola bilməz</p>
          )}
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
            className={!isValidDate.to ? "border-red-500" : ""}
          />
          {!isValidDate.to && (
            <p className="text-xs text-red-500">Son tarix başlanğıc tarixindən kiçik ola bilməz</p>
          )}
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
        <Button 
          className="bg-infoline-blue hover:bg-infoline-dark-blue" 
          onClick={handleApply}
          disabled={!isValidDate.from || !isValidDate.to}
        >
          Tətbiq et
        </Button>
      </div>
    </div>
  );
};
