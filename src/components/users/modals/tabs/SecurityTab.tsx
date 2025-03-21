
import React, { useState } from 'react';
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormContext } from 'react-hook-form';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import { generateRandomPassword } from '@/utils/passwordUtils';

interface SecurityTabProps {
  isEditing: boolean;
}

export const SecurityTab: React.FC<SecurityTabProps> = ({ isEditing }) => {
  const form = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  
  const handleGeneratePassword = () => {
    const newPassword = generateRandomPassword();
    form.setValue('password', newPassword);
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Şifrə {isEditing ? '(Dəyişmək üçün doldurun)' : ''}</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder={isEditing ? "Yeni şifrə" : "Şifrə daxil edin"} 
                  {...field} 
                />
                <button 
                  type="button"
                  className="absolute right-10 top-2.5 text-infoline-dark-gray hover:text-infoline-blue transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
                <button 
                  type="button"
                  className="absolute right-2 top-2.5 text-infoline-dark-gray hover:text-infoline-blue transition-colors"
                  onClick={handleGeneratePassword}
                  title="Random şifrə yarat"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </FormControl>
            <FormDescription>
              {isEditing 
                ? "Dəyişdirmək istəmirsinizsə, boş saxlayın" 
                : "Ən azı 8 simvoldan ibarət güclü şifrə istifadə edin"}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {!isEditing && (
        <div className="flex justify-end">
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={handleGeneratePassword}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Təsadüfi şifrə yarat
          </Button>
        </div>
      )}
    </div>
  );
};

export default SecurityTab;
