
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSchoolTypes } from '../hooks/useSchoolTypes';
import { School, SchoolType } from '@/lib/supabase/types/school';

interface SelectSchoolTypeProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const SelectSchoolType: React.FC<SelectSchoolTypeProps> = ({
  value,
  onChange,
  placeholder = "Məktəb növünü seçin",
  disabled = false,
}) => {
  const { data: schoolTypes = [], isLoading } = useSchoolTypes();

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled || isLoading}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {schoolTypes && schoolTypes.length > 0 ? (
          schoolTypes.map((type: SchoolType) => (
            <SelectItem key={type.id} value={type.id}>
              {type.name}
            </SelectItem>
          ))
        ) : (
          <SelectItem value="none" disabled>
            Məktəb növləri tapılmadı
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
};

export default SelectSchoolType;
