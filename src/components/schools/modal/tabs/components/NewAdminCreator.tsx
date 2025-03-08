import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff, RefreshCw } from "lucide-react";
import { useState } from "react";
import { validatePassword } from "@/utils/passwordUtils";
import { NewAdminForm } from "@/services/admin/adminService";

interface NewAdminCreatorProps {
  newAdmin: NewAdminForm;
  onUpdateNewAdmin: (updatedAdmin: NewAdminForm) => void;
  isAssigning: boolean;
  onCreate: () => void;
  onGenerateNewPassword?: () => string;
}

export const NewAdminCreator = ({
  newAdmin,
  onUpdateNewAdmin,
  isAssigning,
  onCreate,
  onGenerateNewPassword
}: NewAdminCreatorProps) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const handleGeneratePassword = () => {
    if (onGenerateNewPassword) {
      const newPassword = onGenerateNewPassword();
      onUpdateNewAdmin({...newAdmin, password: newPassword});
    }
  };
  
  const isPasswordValid = validatePassword(newAdmin.password);
  const isFormValid = newAdmin.firstName && newAdmin.lastName && newAdmin.email && isPasswordValid;

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-infoline-dark-gray">Yeni admin yarat</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-infoline-dark-gray block">
            Ad <span className="text-red-500">*</span>
          </label>
          <Input 
            placeholder="Adı daxil edin" 
            value={newAdmin.firstName} 
            onChange={(e) => onUpdateNewAdmin({...newAdmin, firstName: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-infoline-dark-gray block">
            Soyad <span className="text-red-500">*</span>
          </label>
          <Input 
            placeholder="Soyadı daxil edin" 
            value={newAdmin.lastName} 
            onChange={(e) => onUpdateNewAdmin({...newAdmin, lastName: e.target.value})}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-infoline-dark-gray block">
            E-poçt <span className="text-red-500">*</span>
          </label>
          <Input 
            type="email" 
            placeholder="E-poçt ünvanını daxil edin" 
            value={newAdmin.email} 
            onChange={(e) => onUpdateNewAdmin({...newAdmin, email: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-infoline-dark-gray block">
            Telefon
          </label>
          <Input 
            placeholder="Telefon nömrəsini daxil edin" 
            value={newAdmin.phone} 
            onChange={(e) => onUpdateNewAdmin({...newAdmin, phone: e.target.value})}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-infoline-dark-gray block">
          Şifrə <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Input 
            type={showPassword ? "text" : "password"}
            placeholder="Şifrə daxil edin"
            value={newAdmin.password || ''}
            onChange={(e) => onUpdateNewAdmin({...newAdmin, password: e.target.value})}
            className={!isPasswordValid && newAdmin.password ? "border-red-500" : ""}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex">
            <button 
              type="button"
              className="text-gray-500 hover:text-gray-700 mr-2"
              onClick={handleGeneratePassword}
              title="Yeni şifrə generasiya et"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button 
              type="button"
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? "Şifrəni gizlət" : "Şifrəni göstər"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div className="text-xs">
          <p className={isPasswordValid ? "text-green-600" : "text-gray-500"}>
            Şifrə tələbləri:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-1">
            <li className={newAdmin.password && newAdmin.password.length >= 8 ? "text-green-600" : "text-gray-500"}>
              Ən azı 8 simvol
            </li>
            <li className={newAdmin.password && /[A-Z]/.test(newAdmin.password) ? "text-green-600" : "text-gray-500"}>
              Ən azı bir böyük hərf (A-Z)
            </li>
            <li className={newAdmin.password && /[a-z]/.test(newAdmin.password) ? "text-green-600" : "text-gray-500"}>
              Ən azı bir kiçik hərf (a-z)
            </li>
            <li className={newAdmin.password && /[0-9]/.test(newAdmin.password) ? "text-green-600" : "text-gray-500"}>
              Ən azı bir rəqəm (0-9)
            </li>
            <li className={newAdmin.password && /[!@#$%^&*]/.test(newAdmin.password) ? "text-green-600" : "text-gray-500"}>
              Ən azı bir xüsusi simvol (!@#$%^&*)
            </li>
          </ul>
        </div>
      </div>
      
      <Button 
        className="w-full" 
        onClick={onCreate} 
        disabled={isAssigning || !isFormValid}
      >
        {isAssigning ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Gözləyin...
          </>
        ) : 'Yarat və Təyin et'}
      </Button>
    </div>
  );
};
