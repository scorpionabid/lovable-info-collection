
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { User } from "@/services/api/userService";

interface ExistingAdminSelectorProps {
  users: User[];
  isLoading: boolean;
  selectedUserId: string;
  onSelectUser: (userId: string) => void;
  isAssigning: boolean;
  onAssign: () => void;
}

export const ExistingAdminSelector = ({
  users,
  isLoading,
  selectedUserId,
  onSelectUser,
  isAssigning,
  onAssign
}: ExistingAdminSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-infoline-dark-gray block">
        Admin seçin
      </label>
      <Select value={selectedUserId} onValueChange={onSelectUser} disabled={isLoading}>
        <SelectTrigger>
          <SelectValue placeholder={isLoading ? "Yüklənir..." : "Mövcud istifadəçini seçin"} />
        </SelectTrigger>
        <SelectContent>
          {users.length > 0 ? (
            users.map(user => (
              <SelectItem key={user.id} value={user.id}>
                {user.first_name} {user.last_name} ({user.email})
              </SelectItem>
            ))
          ) : (
            <SelectItem value="none" disabled>Təyin edilməmiş admin yoxdur</SelectItem>
          )}
        </SelectContent>
      </Select>
      
      <Button 
        className="w-full mt-2" 
        onClick={onAssign} 
        disabled={!selectedUserId || isAssigning}
      >
        {isAssigning ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Gözləyin...
          </>
        ) : 'Təyin et'}
      </Button>
    </div>
  );
};
