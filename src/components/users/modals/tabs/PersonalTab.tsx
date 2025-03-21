
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormField } from '@/components/ui/form';
import { User } from '@/lib/supabase/types';

interface PersonalTabProps {
  formData: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    utis_code: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Record<string, string>;
  isViewMode: boolean;
  user?: User;
}

export const PersonalTab: React.FC<PersonalTabProps> = ({
  formData,
  handleInputChange,
  errors,
  isViewMode,
  user
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">Ad</Label>
          <Input
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            readOnly={isViewMode}
            className={errors.first_name ? 'border-red-500' : ''}
          />
          {errors.first_name && (
            <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="last_name">Soyad</Label>
          <Input
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            readOnly={isViewMode}
            className={errors.last_name ? 'border-red-500' : ''}
          />
          {errors.last_name && (
            <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          readOnly={isViewMode || (user && !!user.id)}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Telefon</Label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          readOnly={isViewMode}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="utis_code">UTİS Kodu</Label>
        <Input
          id="utis_code"
          name="utis_code"
          value={formData.utis_code}
          onChange={handleInputChange}
          readOnly={isViewMode}
        />
      </div>
    </div>
  );
};

export default PersonalTab;
