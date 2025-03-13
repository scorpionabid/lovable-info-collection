import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface SectorFilterProps {
  regionId: string; // Add regionId prop
  value: string; // Add value prop
  onChange: (value: string) => void; // Add onChange prop
}

export const SectorFilter: React.FC<SectorFilterProps> = ({ regionId, value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="sector-filter">Sector</Label>
      <Select value={value} onValueChange={onChange} disabled={!regionId}>
        <SelectTrigger id="sector-filter">
          <SelectValue placeholder="All sectors" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All sectors</SelectItem>
          {/* Add your sectors dynamically here */}
        </SelectContent>
      </Select>
    </div>
  );
};
