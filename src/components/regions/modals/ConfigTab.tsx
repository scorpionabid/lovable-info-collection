
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ConfigTab = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="notificationLevel">Bildiriş səviyyəsi</Label>
        <Select>
          <SelectTrigger id="notificationLevel">
            <SelectValue placeholder="Bildiriş səviyyəsini seçin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">Yüksək</SelectItem>
            <SelectItem value="medium">Orta</SelectItem>
            <SelectItem value="low">Aşağı</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="deadline">Son tarix</Label>
        <Input id="deadline" type="date" />
      </div>
    </div>
  );
};
