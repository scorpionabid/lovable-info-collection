
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface CategoryFilterPanelProps {
  onClose: () => void;
}

export const CategoryFilterPanel = ({ onClose }: CategoryFilterPanelProps) => {
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
            Kateqoriya adı
          </label>
          <Input id="name" placeholder="Kateqoriya adı axtar..." />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="assignment" className="text-sm font-medium text-infoline-dark-gray">
            Təyinat
          </label>
          <Select>
            <SelectTrigger id="assignment">
              <SelectValue placeholder="Bütün təyinatlar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Bütün təyinatlar</SelectItem>
              <SelectItem value="all-schools">All</SelectItem>
              <SelectItem value="sectors">Sectors</SelectItem>
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
              <SelectItem value="inactive">Deaktiv</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="deadline" className="text-sm font-medium text-infoline-dark-gray">
            Son tarix
          </label>
          <Input id="deadline" type="date" />
        </div>
      </div>
      
      <div className="mt-4 border-t pt-4 border-infoline-light-gray">
        <h4 className="text-sm font-medium text-infoline-dark-blue mb-2">Doldurma faizi</h4>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="completion-high" />
            <Label htmlFor="completion-high" className="text-sm">Yüksək (&gt;80%)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="completion-medium" />
            <Label htmlFor="completion-medium" className="text-sm">Orta (50-80%)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="completion-low" />
            <Label htmlFor="completion-low" className="text-sm">Aşağı (&lt;50%)</Label>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onClose}>Ləğv et</Button>
        <Button className="bg-infoline-blue hover:bg-infoline-dark-blue">Tətbiq et</Button>
      </div>
    </div>
  );
};
