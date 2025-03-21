
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BasicInfoTabProps {
  formData: {
    name: string;
    code: string;
    description: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ formData, handleChange }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Region adı</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Region adını daxil edin"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="code">Region kodu</Label>
        <Input
          id="code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          placeholder="Region kodunu daxil edin (istəyə bağlı)"
        />
        <p className="text-xs text-infoline-dark-gray">
          Region kodunu daxil edin. Bu kod sistemdə regionu identifikasiya etmək üçün istifadə oluna bilər.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Təsvir</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Region haqqında qısa məlumat (istəyə bağlı)"
          rows={4}
        />
      </div>
    </div>
  );
};
