
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface School {
  id: string;
  name: string;
}

interface SchoolFilterProps {
  schools: School[];
  selectedSchool?: string;
  onChange: (value: string | undefined) => void;
  isLoading: boolean;
  disabled: boolean;
}

export const SchoolFilter = ({ 
  schools, 
  selectedSchool, 
  onChange, 
  isLoading, 
  disabled 
}: SchoolFilterProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor="school" className="text-sm font-medium text-infoline-dark-gray">
        Məktəb
      </label>
      <Select 
        value={selectedSchool} 
        onValueChange={(value) => onChange(value === 'all' ? undefined : value)}
        disabled={disabled || isLoading}
      >
        <SelectTrigger id="school">
          <SelectValue placeholder="Bütün məktəblər" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Bütün məktəblər</SelectItem>
          {schools.map((school) => (
            <SelectItem key={school.id} value={school.id}>
              {school.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
