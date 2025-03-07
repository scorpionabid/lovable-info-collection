
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface NewAdminFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
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
