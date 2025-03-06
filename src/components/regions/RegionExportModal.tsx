
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { X, FileText, Download } from "lucide-react";
import { RegionWithStats } from '@/services/supabase/region';
import { fileExport } from '@/utils/fileExport';
import { useToast } from '@/hooks/use-toast';

interface RegionExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  region: RegionWithStats;
}

export const RegionExportModal = ({ isOpen, onClose, region }: RegionExportModalProps) => {
  const { toast } = useToast();
  const [exportFormat, setExportFormat] = useState("excel");
  const [dateRange, setDateRange] = useState({
    from: '',
    to: ''
  });
  const [selectedFields, setSelectedFields] = useState<string[]>([
    "name", "description", "sectorCount", "schoolCount", "completionRate", "createdAt"
  ]);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleFieldToggle = (field: string) => {
    setSelectedFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field) 
        : [...prev, field]
    );
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      const exportData: Record<string, any>[] = [];
      const dataObj: Record<string, any> = {};
      
      if (selectedFields.includes('name')) {
        dataObj['Ad'] = region.name;
      }
      
      if (selectedFields.includes('description')) {
        dataObj['Təsvir'] = region.description || '';
      }

      if (selectedFields.includes('code')) {
        dataObj['Kod'] = region.code || '';
      }
      
      if (selectedFields.includes('sectorCount')) {
        dataObj['Sektor sayı'] = region.sectorCount;
      }
      
      if (selectedFields.includes('schoolCount')) {
        dataObj['Məktəb sayı'] = region.schoolCount;
      }
      
      if (selectedFields.includes('completionRate')) {
        dataObj['Doldurma faizi'] = `${region.completionRate}%`;
      }
      
      if (selectedFields.includes('createdAt')) {
        dataObj['Yaradılma tarixi'] = new Date(region.created_at).toLocaleDateString('az-AZ');
      }

      if (selectedFields.includes('updatedAt') && region.updated_at) {
        dataObj['Yenilənmə tarixi'] = new Date(region.updated_at).toLocaleDateString('az-AZ');
      }
      
      exportData.push(dataObj);
      
      if (dateRange.from && dateRange.to) {
        const fromDate = new Date(dateRange.from);
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999); // Set to end of day
        
        const createdAt = new Date(region.created_at);
        if (createdAt < fromDate || createdAt > toDate) {
          setIsExporting(false);
          toast({
            title: "Tarix xətası",
            description: "Seçilmiş tarix aralığında məlumat tapılmadı",
            variant: "destructive",
          });
          return;
        }
      }
      
      await fileExport({
        data: exportData,
        fileName: `Region-${region.name.replace(/\s+/g, '-')}`,
        fileType: exportFormat as 'xlsx' | 'csv' | 'pdf'
      });
      
      toast({
        title: "İxrac əməliyyatı uğurla tamamlandı",
        description: `${region.name} regionu ${exportFormat} formatında ixrac edildi`,
      });
      
      onClose();
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "İxrac xətası",
        description: "Məlumatları ixrac edərkən xəta baş verdi",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-infoline-light-gray">
          <h2 className="text-xl font-semibold text-infoline-dark-blue">
            Regionu İxrac Et: {region.name}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="exportFormat">İxrac formatı</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger id="exportFormat">
                  <SelectValue placeholder="Format seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                  <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                  <SelectItem value="csv">CSV (.csv)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateFrom">Tarixdən</Label>
                <Input 
                  id="dateFrom" 
                  type="date" 
                  value={dateRange.from}
                  onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dateTo">Tarixə qədər</Label>
                <Input 
                  id="dateTo" 
                  type="date" 
                  value={dateRange.to}
                  onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>İxrac ediləcək məlumatlar</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="field-name" 
                    checked={selectedFields.includes("name")}
                    onCheckedChange={() => handleFieldToggle("name")}
                  />
                  <label
                    htmlFor="field-name"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Region adı
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="field-description" 
                    checked={selectedFields.includes("description")}
                    onCheckedChange={() => handleFieldToggle("description")}
                  />
                  <label
                    htmlFor="field-description"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Təsvir
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="field-code" 
                    checked={selectedFields.includes("code")}
                    onCheckedChange={() => handleFieldToggle("code")}
                  />
                  <label
                    htmlFor="field-code"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Kod
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="field-sectors" 
                    checked={selectedFields.includes("sectorCount")}
                    onCheckedChange={() => handleFieldToggle("sectorCount")}
                  />
                  <label
                    htmlFor="field-sectors"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Sektor sayı
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="field-schools" 
                    checked={selectedFields.includes("schoolCount")}
                    onCheckedChange={() => handleFieldToggle("schoolCount")}
                  />
                  <label
                    htmlFor="field-schools"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Məktəb sayı
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="field-completion" 
                    checked={selectedFields.includes("completionRate")}
                    onCheckedChange={() => handleFieldToggle("completionRate")}
                  />
                  <label
                    htmlFor="field-completion"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Doldurma faizi
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="field-createdAt" 
                    checked={selectedFields.includes("createdAt")}
                    onCheckedChange={() => handleFieldToggle("createdAt")}
                  />
                  <label
                    htmlFor="field-createdAt"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Yaradılma tarixi
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="field-updatedAt" 
                    checked={selectedFields.includes("updatedAt")}
                    onCheckedChange={() => handleFieldToggle("updatedAt")}
                  />
                  <label
                    htmlFor="field-updatedAt"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Yenilənmə tarixi
                  </label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="template">İxrac şablonu</Label>
              <Select>
                <SelectTrigger id="template">
                  <SelectValue placeholder="Şablon seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Standart şablon</SelectItem>
                  <SelectItem value="detailed">Ətraflı şablon</SelectItem>
                  <SelectItem value="summary">Xülasə şablonu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-infoline-light-gray">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={onClose}
              disabled={isExporting}
            >
              <X className="h-4 w-4" />
              Ləğv et
            </Button>
            <Button 
              className="bg-infoline-blue hover:bg-infoline-dark-blue flex items-center gap-2"
              onClick={handleExport}
              disabled={isExporting || selectedFields.length === 0}
            >
              <Download className="h-4 w-4" />
              {isExporting ? 'İxrac edilir...' : 'İxrac et'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
