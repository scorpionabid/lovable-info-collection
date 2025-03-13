import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface RegionFilterProps {
  value: string; // Add value prop
  onChange: (value: string) => void; // Add onChange prop
}

export const RegionFilter: React.FC<RegionFilterProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="region-filter">Region</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="region-filter">
          <SelectValue placeholder="All regions" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All regions</SelectItem>
          {/* Add your regions dynamically here */}
        </SelectContent>
      </Select>
    </div>
  );
};
