
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BasicInfoTabProps {
  formData: {
    name: string;
    code: string;
    description: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const BasicInfoTab = ({ formData, handleChange }: BasicInfoTabProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Region adı *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Region adını daxil edin"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="code">Region kodu</Label>
        <Input
          id="code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          placeholder="Region kodunu daxil edin"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Təsvir</Label>
        <Input
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Region haqqında qısa məlumat"
        />
      </div>
    </div>
  );
};
