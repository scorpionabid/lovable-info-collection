
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface RoleFilterProps {
  value: string; // Add value prop
  onChange: (value: string) => void; // Add onChange prop
}

export const RoleFilter: React.FC<RoleFilterProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="role-filter">Role</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="role-filter">
          <SelectValue placeholder="All roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All roles</SelectItem>
          <SelectItem value="super-admin">Super Admin</SelectItem>
          <SelectItem value="region-admin">Region Admin</SelectItem>
          <SelectItem value="sector-admin">Sector Admin</SelectItem>
          <SelectItem value="school-admin">School Admin</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
