
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { UserFormValues } from "./UserFormSchema";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/services/api/userService";

interface AccountSettingsProps {
  form: UseFormReturn<UserFormValues>;
  isEditing: boolean;
  user?: User;
}

export const AccountSettings = ({ form, isEditing, user }: AccountSettingsProps) => {
  const { toast } = useToast();

  const handleResetPassword = () => {
    // This would call the password reset API
    if (user?.email) {
      toast({
        title: "Şifrə sıfırlama",
        description: `${user.email} adresinə şifrə sıfırlama linki göndərildi`,
      });
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-infoline-dark-blue">Hesab Parametrləri</h4>
      
      <div className="flex items-center justify-between py-2">
        <div>
          <h5 className="font-medium text-infoline-dark-blue">Hesabı aktiv et</h5>
          <p className="text-sm text-infoline-dark-gray">İstifadəçi sistemə daxil ola bilər</p>
        </div>
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Switch 
                  checked={field.value} 
                  onCheckedChange={field.onChange} 
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      
      {isEditing && (
        <div className="flex items-center justify-between py-2">
          <div>
            <h5 className="font-medium text-infoline-dark-blue">Şifrəni sıfırla</h5>
            <p className="text-sm text-infoline-dark-gray">İstifadəçiyə şifrə sıfırlama linki göndərilir</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            type="button"
            onClick={handleResetPassword}
          >
            Şifrəni sıfırla
          </Button>
        </div>
      )}
    </div>
  );
};
