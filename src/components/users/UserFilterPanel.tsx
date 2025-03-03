
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

interface UserFilterPanelProps {
  onClose: () => void;
}

export const UserFilterPanel = ({ onClose }: UserFilterPanelProps) => {
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
            Ad
          </label>
          <Input id="name" placeholder="Ad axtar..." />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="surname" className="text-sm font-medium text-infoline-dark-gray">
            Soyad
          </label>
          <Input id="surname" placeholder="Soyad axtar..." />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-infoline-dark-gray">
            E-mail
          </label>
          <Input id="email" placeholder="E-mail axtar..." />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="role" className="text-sm font-medium text-infoline-dark-gray">
            Rol
          </label>
          <Select>
            <SelectTrigger id="role">
              <SelectValue placeholder="Bütün rollar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Bütün rollar</SelectItem>
              <SelectItem value="super-admin">SuperAdmin</SelectItem>
              <SelectItem value="region-admin">Region Admin</SelectItem>
              <SelectItem value="sector-admin">Sektor Admin</SelectItem>
              <SelectItem value="school-admin">Məktəb Admin</SelectItem>
            </SelectContent>
          </Select>
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
              <SelectItem value="baku">Bakı</SelectItem>
              <SelectItem value="ganja">Gəncə</SelectItem>
              <SelectItem value="sumgait">Sumqayıt</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="sector" className="text-sm font-medium text-infoline-dark-gray">
            Sektor
          </label>
          <Select>
            <SelectTrigger id="sector">
              <SelectValue placeholder="Bütün sektorlar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Bütün sektorlar</SelectItem>
              <SelectItem value="yasamal">Yasamal</SelectItem>
              <SelectItem value="nasimi">Nəsimi</SelectItem>
              <SelectItem value="sabail">Səbail</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="school" className="text-sm font-medium text-infoline-dark-gray">
            Məktəb
          </label>
          <Select>
            <SelectTrigger id="school">
              <SelectValue placeholder="Bütün məktəblər" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Bütün məktəblər</SelectItem>
              <SelectItem value="school-45">45 nömrəli məktəb</SelectItem>
              <SelectItem value="school-134">134 nömrəli məktəb</SelectItem>
              <SelectItem value="school-220">220 nömrəli məktəb</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium text-infoline-dark-gray">
            Status
          </label>
          <Select>
            <SelectTrigger id="status">
              <SelectValue placeholder="Bütün statuslar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Bütün statuslar</SelectItem>
              <SelectItem value="active">Aktiv</SelectItem>
              <SelectItem value="inactive">Qeyri-aktiv</SelectItem>
              <SelectItem value="blocked">Bloklanmış</SelectItem>
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
