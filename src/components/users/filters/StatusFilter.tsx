
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserStatus } from '@/services/supabase/user/types';

export interface StatusFilterProps {
  value: string; // Add value prop
  onChange: (value: UserStatus) => void; // Add onChange prop
}

export const StatusFilter: React.FC<StatusFilterProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="status-filter">Status</Label>
      <Select value={value} onValueChange={(val) => onChange(val as UserStatus)}>
        <SelectTrigger id="status-filter">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
