
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface NewAdminFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
}

interface NewAdminCreatorProps {
  newAdmin: NewAdminFormState;
  onUpdateNewAdmin: (updatedAdmin: NewAdminFormState) => void;
  isAssigning: boolean;
  onCreate: () => void;
}

export const NewAdminCreator = ({
  newAdmin,
  onUpdateNewAdmin,
  isAssigning,
  onCreate
}: NewAdminCreatorProps) => {
  const [showPassword, setShowPassword] = useState(false);

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
          />
          <button 
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <p className="text-xs text-gray-500">Ən azı 8 simvol olmalıdır. Default şifrə avtomatik yaradılıb.</p>
      </div>
      
      <Button 
        className="w-full" 
        onClick={onCreate} 
        disabled={isAssigning}
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
