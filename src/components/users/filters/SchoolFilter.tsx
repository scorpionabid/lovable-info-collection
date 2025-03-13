import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface SchoolFilterProps {
  sectorId: string; // Add sectorId prop
  value: string; // Add value prop
  onChange: (value: string) => void; // Add onChange prop
}

export const SchoolFilter: React.FC<SchoolFilterProps> = ({ sectorId, value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="school-filter">School</Label>
      <Select value={value} onValueChange={onChange} disabled={!sectorId}>
        <SelectTrigger id="school-filter">
          <SelectValue placeholder="All schools" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All schools</SelectItem>
          {/* Add your schools dynamically here */}
        </SelectContent>
      </Select>
    </div>
  );
};
