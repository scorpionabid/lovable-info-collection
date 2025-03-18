
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import { CalendarIcon, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FilterParams } from '@/services/supabase/sector/types';
import sectorService from '@/services/supabase/sectorService';

interface SectorFilterPanelProps {
  onClose: () => void;
  onApplyFilters: (filters: FilterParams) => void;
  initialFilters: FilterParams;
}

export const SectorFilterPanel = ({ onClose, onApplyFilters, initialFilters }: SectorFilterPanelProps) => {
  const [filters, setFilters] = useState<FilterParams>(initialFilters);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(
    initialFilters.dateFrom ? new Date(initialFilters.dateFrom) : undefined
  );
  const [dateTo, setDateTo] = useState<Date | undefined>(
    initialFilters.dateTo ? new Date(initialFilters.dateTo) : undefined
  );

  // Fetch regions for dropdown
  const { data: regions = [] } = useQuery({
    queryKey: ['regions-dropdown'],
    queryFn: () => sectorService.getRegionsForDropdown()
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleDateFromChange = (date?: Date) => {
    setDateFrom(date);
    if (date) {
      setFilters(prev => ({ ...prev, dateFrom: format(date, 'yyyy-MM-dd') }));
    } else {
      setFilters(prev => ({ ...prev, dateFrom: undefined }));
    }
  };

  const handleDateToChange = (date?: Date) => {
    setDateTo(date);
    if (date) {
      setFilters(prev => ({ ...prev, dateTo: format(date, 'yyyy-MM-dd') }));
    } else {
      setFilters(prev => ({ ...prev, dateTo: undefined }));
    }
  };

  const handleClearFilters = () => {
    setFilters({
      searchQuery: '',
      regionId: '',
      dateFrom: '',
      dateTo: '',
      completionRate: 'all'
    });
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-infoline-dark-blue">Filtrlər</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="searchQuery">Axtarış</Label>
          <Input
            id="searchQuery"
            name="searchQuery"
            placeholder="Ad və ya təsvir üzrə axtar"
            value={filters.searchQuery || ''}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="regionFilter">Region</Label>
          <Select 
            value={filters.regionId} 
            onValueChange={(value) => handleSelectChange('regionId', value)}
          >
            <SelectTrigger id="regionFilter">
              <SelectValue placeholder="Bütün regionlar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Bütün regionlar</SelectItem>
              {regions.map((region) => (
                <SelectItem key={region.id} value={region.id}>{region.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="completionRateFilter">Doldurma faizi</Label>
          <Select 
            value={filters.completionRate} 
            onValueChange={(value) => handleSelectChange('completionRate', value as 'all' | 'high' | 'medium' | 'low')}
          >
            <SelectTrigger id="completionRateFilter">
              <SelectValue placeholder="Bütün" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Bütün</SelectItem>
              <SelectItem value="high">Yüksək (80-100%)</SelectItem>
              <SelectItem value="medium">Orta (50-79%)</SelectItem>
              <SelectItem value="low">Aşağı (0-49%)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Başlanğıc tarix</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom ? format(dateFrom, "dd.MM.yyyy") : "Tarix seçin"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={handleDateFromChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label>Son tarix</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateTo ? format(dateTo, "dd.MM.yyyy") : "Tarix seçin"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={handleDateToChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mt-6">
        <Button 
          variant="outline" 
          onClick={handleClearFilters}
        >
          Təmizlə
        </Button>
        <Button 
          onClick={handleApplyFilters}
          className="bg-infoline-blue hover:bg-infoline-dark-blue"
        >
          Tətbiq et
        </Button>
      </div>
    </div>
  );
};
