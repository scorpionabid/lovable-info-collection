
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryColumn } from "../types";

interface ColumnFormFieldsProps {
  columnFormData: Partial<CategoryColumn>;
  columnFormErrors: Record<string, string>;
  isSubmitting: boolean;
  handleColumnFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleColumnTypeChange: (value: string) => void;
  handleRequiredChange: (checked: boolean) => void;
}

export const ColumnFormFields: React.FC<ColumnFormFieldsProps> = ({
  columnFormData,
  columnFormErrors,
  isSubmitting,
  handleColumnFormChange,
  handleColumnTypeChange,
  handleRequiredChange
}) => {
  return (
    <div className="py-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="column-name" className={columnFormErrors.name ? 'text-red-500' : ''}>
          Sütun adı *
        </Label>
        <Input
          id="column-name"
          name="name"
          placeholder="Sütun adını daxil edin"
          value={columnFormData.name || ''}
          onChange={handleColumnFormChange}
          className={columnFormErrors.name ? 'border-red-500' : ''}
          disabled={isSubmitting}
        />
        {columnFormErrors.name && (
          <p className="text-xs text-red-500">{columnFormErrors.name}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="column-type" className={columnFormErrors.type ? 'text-red-500' : ''}>
          Sütun tipi *
        </Label>
        <Select 
          value={columnFormData.type} 
          onValueChange={handleColumnTypeChange}
          disabled={isSubmitting}
        >
          <SelectTrigger id="column-type" className={columnFormErrors.type ? 'border-red-500' : ''}>
            <SelectValue placeholder="Tip seçin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Mətn (Text)</SelectItem>
            <SelectItem value="number">Rəqəm (Number)</SelectItem>
            <SelectItem value="date">Tarix (Date)</SelectItem>
            <SelectItem value="select">Seçim (Select)</SelectItem>
            <SelectItem value="textarea">Uzun Mətn (Textarea)</SelectItem>
            <SelectItem value="checkbox">Seçim qutusu (Checkbox)</SelectItem>
            <SelectItem value="file">Fayl (File)</SelectItem>
          </SelectContent>
        </Select>
        {columnFormErrors.type && (
          <p className="text-xs text-red-500">{columnFormErrors.type}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="column-description">Təsvir</Label>
        <Input
          id="column-description"
          name="description"
          placeholder="Sütun təsvirini daxil edin"
          value={columnFormData.description || ''}
          onChange={handleColumnFormChange}
          disabled={isSubmitting}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="column-required">Məcburilik statusu</Label>
        <div className="flex items-center space-x-2">
          <Switch
            id="column-required"
            checked={columnFormData.required}
            onCheckedChange={handleRequiredChange}
            disabled={isSubmitting}
          />
          <span className="text-sm text-infoline-dark-gray">Məcburi sahə</span>
        </div>
      </div>
    </div>
  );
};
