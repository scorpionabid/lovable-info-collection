
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Region {
  id: string;
  name: string;
}

interface RegionFilterProps {
  regions: Region[];
  selectedRegion?: string;
  onChange: (value: string | undefined) => void;
  isLoading: boolean;
}

export const RegionFilter = ({ regions, selectedRegion, onChange, isLoading }: RegionFilterProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor="region" className="text-sm font-medium text-infoline-dark-gray">
        Region
      </label>
      <Select 
        value={selectedRegion} 
        onValueChange={(value) => onChange(value === 'all' ? undefined : value)}
        disabled={isLoading}
      >
        <SelectTrigger id="region">
          <SelectValue placeholder="Bütün regionlar" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Bütün regionlar</SelectItem>
          {regions.map((region) => (
            <SelectItem key={region.id} value={region.id}>
              {region.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
