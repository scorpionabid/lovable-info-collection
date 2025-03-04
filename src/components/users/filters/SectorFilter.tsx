
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Sector {
  id: string;
  name: string;
}

interface SectorFilterProps {
  sectors: Sector[];
  selectedSector?: string;
  onChange: (value: string | undefined) => void;
  isLoading: boolean;
  disabled: boolean;
}

export const SectorFilter = ({ 
  sectors, 
  selectedSector, 
  onChange, 
  isLoading, 
  disabled 
}: SectorFilterProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor="sector" className="text-sm font-medium text-infoline-dark-gray">
        Sektor
      </label>
      <Select 
        value={selectedSector} 
        onValueChange={(value) => onChange(value === 'all' ? undefined : value)}
        disabled={disabled || isLoading}
      >
        <SelectTrigger id="sector">
          <SelectValue placeholder="Bütün sektorlar" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Bütün sektorlar</SelectItem>
          {sectors.map((sector) => (
            <SelectItem key={sector.id} value={sector.id}>
              {sector.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
