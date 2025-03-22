
import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export interface RegionFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    search: string;
    status: string;
  };
  onApplyFilters: (filters: any) => void;
}

export const RegionFilterPanel: React.FC<RegionFilterPanelProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleStatusChange = (value: string) => {
    setLocalFilters({
      ...localFilters,
      status: value
    });
  };

  const handleApplyFilters = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleResetFilters = () => {
    const resetFilters = {
      search: '',
      status: 'active'
    };
    setLocalFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Filterlər</SheetTitle>
          <SheetDescription>
            Regionları filtirləmək üçün parametrləri seçin
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-6">
          <div className="space-y-2">
            <Label>Status</Label>
            <RadioGroup 
              value={localFilters.status}
              onValueChange={handleStatusChange}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="active" id="active" />
                <Label htmlFor="active">Aktiv</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inactive" id="inactive" />
                <Label htmlFor="inactive">Deaktiv</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">Hamısı</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="archived" id="archived" />
                <Label htmlFor="archived">Arxivlənmiş</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handleResetFilters}>
              Sıfırla
            </Button>
            <Button onClick={handleApplyFilters}>
              Tətbiq et
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default RegionFilterPanel;
