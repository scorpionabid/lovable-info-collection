
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Save, Undo2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface ReportConfigPanelProps {
  onCancel: () => void;
}

export const ReportConfigPanel = ({ onCancel }: ReportConfigPanelProps) => {
  const [reportType, setReportType] = useState('completion');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedVisual, setSelectedVisual] = useState('bar');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  
  // Sample categories and fields data (would come from API in real app)
  const categories = [
    { id: '1', name: 'Müəllim Məlumatları' },
    { id: '2', name: 'Şagird Məlumatları' },
    { id: '3', name: 'İnfrastruktur' },
    { id: '4', name: 'Tədris Proqramı' },
  ];
  
  const fields = [
    { id: '1', name: 'Ad', category: '1' },
    { id: '2', name: 'Soyad', category: '1' },
    { id: '3', name: 'Doğum tarixi', category: '1' },
    { id: '4', name: 'Cinsi', category: '1' },
    { id: '5', name: 'Ad', category: '2' },
    { id: '6', name: 'Soyad', category: '2' },
    { id: '7', name: 'Sinif', category: '2' },
    { id: '8', name: 'Strukturlar', category: '3' },
    { id: '9', name: 'Avadanlıqlar', category: '3' },
    { id: '10', name: 'Fənnlər', category: '4' },
  ];
  
  const handleGenerateReport = () => {
    // In a real app, this would generate the report with the selected configuration
    console.log({
      reportType,
      selectedCategory,
      selectedFields,
      selectedVisual,
      startDate,
      endDate
    });
    
    // Close the config panel and show the report
    onCancel();
  };
  
  const filteredFields = selectedCategory ? fields.filter(field => field.category === selectedCategory) : [];
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 animate-scale-in">
      <h2 className="text-xl font-semibold text-infoline-dark-blue mb-6">Hesabat Konfiqurasiyası</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="report-type">Hesabat növü</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger id="report-type">
                <SelectValue placeholder="Hesabat növünü seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completion">Doldurulma Statistikası</SelectItem>
                <SelectItem value="performance">Performans Analizi</SelectItem>
                <SelectItem value="trends">Müqayisəli Trendlər</SelectItem>
                <SelectItem value="custom">Custom Hesabat</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Kateqoriya</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Kateqoriya seçin" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedCategory && (
            <div className="space-y-2">
              <Label>Məlumat sahələri</Label>
              <div className="bg-infoline-lightest-gray p-4 rounded-md max-h-48 overflow-y-auto">
                {filteredFields.map(field => (
                  <div key={field.id} className="flex items-center space-x-2 mb-2">
                    <input 
                      type="checkbox" 
                      id={`field-${field.id}`} 
                      className="rounded border-infoline-gray text-infoline-blue"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFields([...selectedFields, field.id]);
                        } else {
                          setSelectedFields(selectedFields.filter(id => id !== field.id));
                        }
                      }}
                      checked={selectedFields.includes(field.id)}
                    />
                    <Label htmlFor={`field-${field.id}`}>{field.name}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Vizualizasiya növü</Label>
            <RadioGroup value={selectedVisual} onValueChange={setSelectedVisual} className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="table" id="visual-table" />
                <Label htmlFor="visual-table">Cədvəl</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bar" id="visual-bar" />
                <Label htmlFor="visual-bar">Bar qrafik</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="line" id="visual-line" />
                <Label htmlFor="visual-line">Xətt qrafik</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pie" id="visual-pie" />
                <Label htmlFor="visual-pie">Pie diaqram</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label>Tarix aralığı</Label>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="w-full sm:w-1/2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Başlanğıc tarix"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="w-full sm:w-1/2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Son tarix"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <Label>Hesabat adı</Label>
            <Input placeholder="Hesabat adını daxil edin" className="mt-1" />
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-end space-x-2 mt-8">
        <Button variant="outline" onClick={onCancel}>
          <Undo2 className="mr-2 h-4 w-4" />
          Ləğv et
        </Button>
        <Button onClick={handleGenerateReport}>
          <Save className="mr-2 h-4 w-4" />
          Hesabatı yarat
        </Button>
      </div>
    </div>
  );
};
