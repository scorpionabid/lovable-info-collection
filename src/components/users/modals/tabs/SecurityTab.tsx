
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from '@/lib/supabase/types';

interface SecurityTabProps {
  formData: {
    password: string;
    is_active: boolean;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBooleanChange: (name: string, value: boolean) => void;
  errors: Record<string, string>;
  isViewMode: boolean;
  user?: User;
  generatePassword: () => void;
  isGeneratingPassword: boolean;
}

export const SecurityTab: React.FC<SecurityTabProps> = ({
  formData,
  handleInputChange,
  handleBooleanChange,
  errors,
  isViewMode,
  user,
  generatePassword,
  isGeneratingPassword
}) => {
  const isCreateMode = !user?.id;
  
  return (
    <div className="space-y-4">
      {isCreateMode && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Şifrə</Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={generatePassword}
              disabled={isGeneratingPassword}
            >
              {isGeneratingPassword ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4 mr-2" />
              )}
              Şifrə yaratmaq
            </Button>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            readOnly={isViewMode}
            className={errors.password ? 'border-red-500' : ''}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>
      )}
      
      <div className="flex items-center space-x-2 pt-4">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => handleBooleanChange('is_active', checked)}
          disabled={isViewMode}
        />
        <Label htmlFor="is_active">Aktiv?</Label>
      </div>
      
      {!isCreateMode && (
        <div className="pt-4">
          <Button type="button" variant="outline" className="w-full">
            Şifrəni sıfırla
          </Button>
          <p className="text-sm text-gray-500 mt-2">
            Bu, istifadəçiyə şifrəni sıfırlamaq üçün bir e-poçt göndərəcək.
          </p>
        </div>
      )}
    </div>
  );
};

export default SecurityTab;
