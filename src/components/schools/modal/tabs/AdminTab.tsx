
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const AdminTab = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-infoline-dark-gray block">
          Admin seçin
        </label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Mövcud istifadəçini seçin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user1">Əliyev Vüqar (vugara@infoline.az)</SelectItem>
            <SelectItem value="user2">Məmmədov Elnur (elnurm@infoline.az)</SelectItem>
            <SelectItem value="user3">Hüseynova Aysel (ayselh@infoline.az)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center">
        <div className="flex-grow border-t border-infoline-light-gray"></div>
        <span className="px-4 text-sm text-infoline-dark-gray">və ya</span>
        <div className="flex-grow border-t border-infoline-light-gray"></div>
      </div>
      
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-infoline-dark-gray">Yeni admin yarat</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-infoline-dark-gray block">
              Ad
            </label>
            <Input placeholder="Adı daxil edin" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-infoline-dark-gray block">
              Soyad
            </label>
            <Input placeholder="Soyadı daxil edin" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-infoline-dark-gray block">
              E-poçt
            </label>
            <Input type="email" placeholder="E-poçt ünvanını daxil edin" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-infoline-dark-gray block">
              Telefon
            </label>
            <Input placeholder="Telefon nömrəsini daxil edin" />
          </div>
        </div>
      </div>
    </div>
  );
};
