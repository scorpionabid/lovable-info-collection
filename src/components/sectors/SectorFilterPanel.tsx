
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

interface SectorFilterPanelProps {
  onClose: () => void;
}

export const SectorFilterPanel = ({ onClose }: SectorFilterPanelProps) => {
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
          <label htmlFor="name" className="text-sm font-medium text-infoline-dark-gray">
            Sektor adı
          </label>
          <Input id="name" placeholder="Sektor adı axtar..." />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="region" className="text-sm font-medium text-infoline-dark-gray">
            Region
          </label>
          <Select>
            <SelectTrigger id="region">
              <SelectValue placeholder="Bütün regionlar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Bütün regionlar</SelectItem>
              <SelectItem value="1">Bakı şəhəri</SelectItem>
              <SelectItem value="2">Gəncə şəhəri</SelectItem>
              <SelectItem value="3">Sumqayıt şəhəri</SelectItem>
              <SelectItem value="4">Şəki rayonu</SelectItem>
              <SelectItem value="5">Quba rayonu</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="date-from" className="text-sm font-medium text-infoline-dark-gray">
            Tarixdən
          </label>
          <Input id="date-from" type="date" />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="date-to" className="text-sm font-medium text-infoline-dark-gray">
            Tarixə qədər
          </label>
          <Input id="date-to" type="date" />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="completion" className="text-sm font-medium text-infoline-dark-gray">
            Doldurma faizi
          </label>
          <Select>
            <SelectTrigger id="completion">
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
        
        <div className="space-y-2">
          <label htmlFor="school-count" className="text-sm font-medium text-infoline-dark-gray">
            Məktəb sayı
          </label>
          <Select>
            <SelectTrigger id="school-count">
              <SelectValue placeholder="Bütün saylar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Bütün saylar</SelectItem>
              <SelectItem value="high">Çox (&gt;20)</SelectItem>
              <SelectItem value="medium">Orta (10-20)</SelectItem>
              <SelectItem value="low">Az (&lt;10)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onClose}>Ləğv et</Button>
        <Button className="bg-infoline-blue hover:bg-infoline-dark-blue">Tətbiq et</Button>
      </div>
    </div>
  );
};
