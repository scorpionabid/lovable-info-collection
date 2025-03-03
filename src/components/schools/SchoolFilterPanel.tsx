
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";

interface SchoolFilterPanelProps {
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export const SchoolFilterPanel = ({ isVisible, onToggleVisibility }: SchoolFilterPanelProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // These would typically be fetched from an API
  const regions = [
    { id: '1', name: 'Bakı şəhəri' },
    { id: '2', name: 'Sumqayıt şəhəri' },
    { id: '3', name: 'Gəncə şəhəri' },
  ];
  
  const sectors = [
    { id: '1', name: 'Nəsimi rayonu' },
    { id: '2', name: 'Yasamal rayonu' },
    { id: '3', name: 'Sabunçu rayonu' },
    { id: '4', name: 'Mərkəz' },
  ];
  
  const handleReset = () => {
    setSearchTerm('');
    // Reset other filter values
  };
  
  if (!isVisible) {
    return (
      <div className="lg:col-span-1 flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onToggleVisibility}
          className="h-8 w-8 p-0 rounded-full"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }
  
  return (
    <div className="lg:col-span-3 bg-white p-4 rounded-lg shadow-sm h-fit">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-infoline-dark-blue">Filterlər</h3>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleReset}
            className="h-8 text-infoline-dark-gray"
          >
            <X className="h-4 w-4 mr-1" />
            Sıfırla
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleVisibility}
            className="h-8 w-8 p-0 lg:flex hidden"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-infoline-dark-gray mb-1 block">
            Axtarış
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-infoline-gray" />
            <Input
              placeholder="Məktəb adı, direktor..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-infoline-dark-gray mb-1 block">
            Region
          </label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Bütün regionlar" />
            </SelectTrigger>
            <SelectContent>
              {regions.map(region => (
                <SelectItem key={region.id} value={region.id}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium text-infoline-dark-gray mb-1 block">
            Sektor
          </label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Bütün sektorlar" />
            </SelectTrigger>
            <SelectContent>
              {sectors.map(sector => (
                <SelectItem key={sector.id} value={sector.id}>
                  {sector.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium text-infoline-dark-gray mb-1 block">
            Məktəb növü
          </label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Bütün növlər" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="middle">Orta məktəb</SelectItem>
              <SelectItem value="high">Tam orta məktəb</SelectItem>
              <SelectItem value="primary">İbtidai məktəb</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium text-infoline-dark-gray mb-1 block">
            Status
          </label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Bütün statuslar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Aktiv</SelectItem>
              <SelectItem value="inactive">Deaktiv</SelectItem>
              <SelectItem value="archived">Arxivləşdirilmiş</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium text-infoline-dark-gray mb-1 block">
            Doldurma faizi
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Min" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0%</SelectItem>
                <SelectItem value="25">25%</SelectItem>
                <SelectItem value="50">50%</SelectItem>
                <SelectItem value="75">75%</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Max" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25%</SelectItem>
                <SelectItem value="50">50%</SelectItem>
                <SelectItem value="75">75%</SelectItem>
                <SelectItem value="100">100%</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="pt-2">
          <Button className="w-full bg-infoline-blue hover:bg-infoline-dark-blue">
            Tətbiq et
          </Button>
        </div>
      </div>
    </div>
  );
};
