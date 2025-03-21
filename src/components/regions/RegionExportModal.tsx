
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FilterParams } from '@/lib/supabase/types';
import { RegionWithStats } from '@/lib/supabase/types/region';

export interface RegionExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters?: FilterParams;
  region?: RegionWithStats;
  onExport?: (format: string) => void;
}

export const RegionExportModal: React.FC<RegionExportModalProps> = ({
  isOpen,
  onClose,
  filters,
  region,
  onExport
}) => {
  const [format, setFormat] = useState<string>('excel');

  const handleExport = () => {
    if (onExport) {
      onExport(format);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {region ? `Export ${region.name} Data` : 'Export Regions Data'}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Export Format</h4>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="excel"
                  name="format"
                  value="excel"
                  checked={format === 'excel'}
                  onChange={() => setFormat('excel')}
                  className="h-4 w-4 text-infoline-blue"
                />
                <label htmlFor="excel" className="text-sm">Excel</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="csv"
                  name="format"
                  value="csv"
                  checked={format === 'csv'}
                  onChange={() => setFormat('csv')}
                  className="h-4 w-4 text-infoline-blue"
                />
                <label htmlFor="csv" className="text-sm">CSV</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="pdf"
                  name="format"
                  value="pdf"
                  checked={format === 'pdf'}
                  onChange={() => setFormat('pdf')}
                  className="h-4 w-4 text-infoline-blue"
                />
                <label htmlFor="pdf" className="text-sm">PDF</label>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleExport}>
            Export
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegionExportModal;
