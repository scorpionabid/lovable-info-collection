
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type UserStatus = 'active' | 'inactive' | 'blocked';

interface StatusFilterProps {
  selectedStatus?: UserStatus;
  onChange: (value: UserStatus | undefined) => void;
}

export const StatusFilter = ({ selectedStatus, onChange }: StatusFilterProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor="status" className="text-sm font-medium text-infoline-dark-gray">
        Status
      </label>
      <Select 
        value={selectedStatus} 
        onValueChange={(value) => onChange(value === 'all' ? undefined : value as UserStatus)}
      >
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
  );
};
