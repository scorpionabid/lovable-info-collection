
import React from "react";
import { Input } from "@/components/ui/input";

interface SearchFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchFilter = ({ value, onChange }: SearchFilterProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor="firstName" className="text-sm font-medium text-infoline-dark-gray">
        Ad
      </label>
      <Input 
        id="firstName" 
        placeholder="Ad axtar..." 
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
