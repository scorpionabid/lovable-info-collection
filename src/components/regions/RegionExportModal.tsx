
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FilterParams } from '@/supabase/types'; // Updated import

interface RegionExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: string, includeStats: boolean) => void;
  filters: FilterParams; // Using FilterParams instead of RegionFilters
}

export const RegionExportModal: React.FC<RegionExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  filters
}) => {
  const [exportFormat, setExportFormat] = React.useState<string>("xlsx");
  const [includeStats, setIncludeStats] = React.useState<boolean>(true);

  const handleExport = () => {
    onExport(exportFormat, includeStats);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Regions</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="format" className="text-right">
              Format
            </Label>
            <Select
              value={exportFormat}
              onValueChange={setExportFormat}
            >
              <SelectTrigger id="format" className="col-span-3">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-span-4 flex items-center space-x-2">
              <Checkbox 
                id="includeStats" 
                checked={includeStats}
                onCheckedChange={(checked) => setIncludeStats(checked as boolean)}
              />
              <Label htmlFor="includeStats">Include statistics</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleExport}>Export</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RegionExportModal;
