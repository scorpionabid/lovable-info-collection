
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, RefreshCcw, Eye, EyeOff } from "lucide-react";
import { NewAdminForm } from "@/services/admin/adminService";

interface NewAdminCreatorProps {
  newAdmin: NewAdminForm;
  onUpdateNewAdmin: (admin: NewAdminForm) => void;
  isAssigning: boolean;
  onCreate: () => void;
  onGenerateNewPassword: () => string;
}

export const NewAdminCreator = ({
  newAdmin,
  onUpdateNewAdmin,
  isAssigning,
  onCreate,
  onGenerateNewPassword
}: NewAdminCreatorProps) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const handleChange = (field: keyof NewAdminForm, value: string) => {
    onUpdateNewAdmin({
      ...newAdmin,
      [field]: value
    });
  };
  
  const handleGeneratePassword = () => {
    const newPassword = onGenerateNewPassword();
    handleChange('password', newPassword);
  };
  
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-infoline-dark-gray">Yeni Admin Yarat</h4>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Ad</Label>
          <Input 
            id="firstName" 
            value={newAdmin.firstName} 
            onChange={(e) => handleChange('firstName', e.target.value)}
            placeholder="Adı daxil edin"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Soyad</Label>
          <Input 
            id="lastName" 
            value={newAdmin.lastName} 
            onChange={(e) => handleChange('lastName', e.target.value)}
            placeholder="Soyadı daxil edin"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email"
          value={newAdmin.email} 
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="Email daxil edin"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Telefon (istəyə bağlı)</Label>
        <Input 
          id="phone" 
          value={newAdmin.phone} 
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="Telefon nömrəsini daxil edin"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="password">Şifrə</Label>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={handleGeneratePassword}
            className="h-6 px-2 text-xs"
          >
            <RefreshCcw className="h-3 w-3 mr-1" /> Şifrə yarat
          </Button>
        </div>
        <div className="relative">
          <Input 
            id="password" 
            type={showPassword ? "text" : "password"}
            value={newAdmin.password} 
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder="Şifrə daxil edin"
            className="pr-10"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>
      
      <Button 
        className="w-full mt-4" 
        onClick={onCreate} 
        disabled={isAssigning || !newAdmin.firstName || !newAdmin.lastName || !newAdmin.email || !newAdmin.password}
      >
        {isAssigning ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Yaradılır...
          </>
        ) : 'Yeni Admin Yarat'}
      </Button>
    </div>
  );
};
