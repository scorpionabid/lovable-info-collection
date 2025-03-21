
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RegionWithStats } from '@/supabase/types';
import { RegionFilters } from '@/supabase/types';

export interface RegionExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  region?: RegionWithStats;
  filters?: {
    search: string;
    status: 'active' | 'inactive' | 'all';
  };
}

export const RegionExportModal: React.FC<RegionExportModalProps> = ({ 
  isOpen, 
  onClose,
  region,
  filters
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'excel' | 'csv'>('excel');
  const [includeFields, setIncludeFields] = useState({
    basic: true,
    sectors: true,
    schools: true,
    stats: true
  });

  const handleFormatChange = (format: 'excel' | 'csv') => {
    setExportFormat(format);
  };

  const handleFieldToggle = (field: keyof typeof includeFields) => {
    setIncludeFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Simulate export
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Exporting with format:', exportFormat);
      console.log('Including fields:', includeFields);
      
      if (region) {
        console.log('Exporting single region:', region.name);
      } else if (filters) {
        console.log('Exporting with filters:', filters);
      } else {
        console.log('Exporting all regions');
      }
      
      onClose();
    } catch (error) {
      console.error('Error exporting regions:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {region ? `"${region.name}" Region İxracı` : 'Regionlar İxracı'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>İxrac formatı</Label>
            <div className="flex space-x-4">
              <Button
                type="button"
                variant={exportFormat === 'excel' ? 'default' : 'outline'}
                onClick={() => handleFormatChange('excel')}
                className="flex-1"
              >
                Excel (.xlsx)
              </Button>
              <Button
                type="button"
                variant={exportFormat === 'csv' ? 'default' : 'outline'}
                onClick={() => handleFormatChange('csv')}
                className="flex-1"
              >
                CSV
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Daxil ediləcək sahələr</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="basic" 
                  checked={includeFields.basic} 
                  onCheckedChange={() => handleFieldToggle('basic')}
                />
                <Label htmlFor="basic">Əsas məlumatlar (Ad, Kod, Təsvir)</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sectors" 
                  checked={includeFields.sectors} 
                  onCheckedChange={() => handleFieldToggle('sectors')}
                />
                <Label htmlFor="sectors">Sektorlar</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="schools" 
                  checked={includeFields.schools} 
                  onCheckedChange={() => handleFieldToggle('schools')}
                />
                <Label htmlFor="schools">Məktəblər</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="stats" 
                  checked={includeFields.stats} 
                  onCheckedChange={() => handleFieldToggle('stats')}
                />
                <Label htmlFor="stats">Statistikalar</Label>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isExporting}>
            Ləğv et
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? 'İxrac edilir...' : 'İxrac et'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
