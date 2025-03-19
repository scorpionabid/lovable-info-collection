
import React, { useState, useEffect } from 'react';
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
import { SchoolFilter } from "@/services/supabase/school/types";
import { useToast } from '@/hooks/use-toast';

interface SchoolFilterPanelProps {
  onApplyFilters: (filters: SchoolFilter) => void;
  onClose: () => void;
  // Support both visibility patterns
  isVisible?: boolean;
  onToggleVisibility?: () => void;
}

export const SchoolFilterPanel: React.FC<SchoolFilterPanelProps> = ({ 
  onApplyFilters, 
  onClose,
  isVisible,
  onToggleVisibility
}) => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<SchoolFilter>({
    search: '',
    region_id: '',
    sector_id: '',
    type_id: '',
    status: 'all',
    min_student_count: '',
    max_student_count: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    // Validate numeric fields
    if (filters.min_student_count && isNaN(Number(filters.min_student_count))) {
      toast({
        title: "Xəta",
        description: "Minimum şagird sayı rəqəm olmalıdır",
        variant: "destructive",
      });
      return;
    }

    if (filters.max_student_count && isNaN(Number(filters.max_student_count))) {
      toast({
        title: "Xəta",
        description: "Maksimum şagird sayı rəqəm olmalıdır",
        variant: "destructive",
      });
      return;
    }

    // Convert string numbers to actual numbers
    const processedFilters = {
      ...filters,
      min_student_count: filters.min_student_count ? Number(filters.min_student_count) : undefined,
      max_student_count: filters.max_student_count ? Number(filters.max_student_count) : undefined,
    };

    onApplyFilters(processedFilters);
  };

  const handleReset = () => {
    setFilters({
      search: '',
      region_id: '',
      sector_id: '',
      type_id: '',
      status: 'all',
      min_student_count: '',
      max_student_count: '',
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
          <Label htmlFor="region_id">Region</Label>
          <Select
            value={filters.region_id}
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
          <Label htmlFor="sector_id">Sektor</Label>
          <Select
            value={filters.sector_id}
            onValueChange={(value) => handleSelectChange('sector_id', value)}
          >
            <SelectTrigger id="sector_id">
              <SelectValue placeholder="Bütün sektorlar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Bütün sektorlar</SelectItem>
              <SelectItem value="1">Sektor 1</SelectItem>
              <SelectItem value="2">Sektor 2</SelectItem>
              <SelectItem value="3">Sektor 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type_id">Məktəb növü</Label>
          <Select
            value={filters.type_id}
            onValueChange={(value) => handleSelectChange('type_id', value)}
          >
            <SelectTrigger id="type_id">
              <SelectValue placeholder="Bütün növlər" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Bütün növlər</SelectItem>
              <SelectItem value="1">Ümumi təhsil</SelectItem>
              <SelectItem value="2">Lisey</SelectItem>
              <SelectItem value="3">Gimnaziya</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={filters.status}
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
          <Label htmlFor="min_student_count">Min. şagird sayı</Label>
          <Input
            id="min_student_count"
            name="min_student_count"
            type="text"
            placeholder="Min."
            value={filters.min_student_count}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="max_student_count">Max. şagird sayı</Label>
          <Input
            id="max_student_count"
            name="max_student_count"
            type="text"
            placeholder="Max."
            value={filters.max_student_count}
            onChange={handleInputChange}
          />
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
