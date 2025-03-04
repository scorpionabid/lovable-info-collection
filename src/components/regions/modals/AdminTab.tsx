
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdminTabProps {
  formData: {
    adminId: string;
  };
  handleSelectChange: (name: string, value: string) => void;
}

export const AdminTab = ({ formData, handleSelectChange }: AdminTabProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="adminSelect">Region Admini</Label>
        <Select
          onValueChange={(value) => handleSelectChange('adminId', value)}
          value={formData.adminId}
        >
          <SelectTrigger id="adminSelect">
            <SelectValue placeholder="Region Admini seçin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">Yeni admin yarat</SelectItem>
            <SelectItem value="user1">Elşən Məmmədov</SelectItem>
            <SelectItem value="user2">Aynur Əliyeva</SelectItem>
            <SelectItem value="user3">Kamran Hüseynov</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {formData.adminId === 'new' && (
        <div className="space-y-4 border p-4 rounded-md border-infoline-light-gray mt-4">
          <h3 className="font-medium text-infoline-dark-blue">Yeni Admin Yarat</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="adminName">Ad</Label>
              <Input id="adminName" placeholder="Adı daxil edin" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminSurname">Soyad</Label>
              <Input id="adminSurname" placeholder="Soyadı daxil edin" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="adminEmail">Email</Label>
            <Input id="adminEmail" type="email" placeholder="Email ünvanını daxil edin" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="adminPhone">Telefon</Label>
            <Input id="adminPhone" placeholder="Telefon nömrəsini daxil edin" />
          </div>
        </div>
      )}
    </div>
  );
};
