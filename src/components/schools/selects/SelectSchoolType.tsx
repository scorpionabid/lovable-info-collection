
import React from 'react';
import { useSchoolTypesQuery } from '@/hooks/useSchoolTypesQuery';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Control, Controller } from 'react-hook-form';

export interface SelectSchoolTypeProps {
  name: string;
  error?: string;
  disabled?: boolean;
  control: Control<any>;
}

const SelectSchoolType: React.FC<SelectSchoolTypeProps> = ({ name, error, disabled, control }) => {
  const { data: schoolTypes, isLoading } = useSchoolTypesQuery();

  if (isLoading) {
    return <div>Məktəb tipləri yüklənir...</div>;
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Select
              disabled={disabled}
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger className={error ? 'border-red-500' : ''}>
                <SelectValue placeholder="Məktəb tipi seçin" />
              </SelectTrigger>
              <SelectContent>
                {schoolTypes && schoolTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          {error && <FormMessage>{error}</FormMessage>}
        </FormItem>
      )}
    />
  );
};

export default SelectSchoolType;
