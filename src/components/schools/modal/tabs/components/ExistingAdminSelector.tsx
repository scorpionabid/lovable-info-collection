
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { User } from "@/services/userService";

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-infoline-dark-gray block">
          Admin seçin
        </label>
        {users.length === 0 && !isLoading && (
          <div className="text-xs text-amber-600 flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            Təyin edilməmiş admin yoxdur
          </div>
        )}
      </div>
      
      <Select value={selectedUserId} onValueChange={onSelectUser} disabled={isLoading || users.length === 0}>
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
        className="w-full" 
        onClick={onAssign} 
        disabled={!selectedUserId || isAssigning || users.length === 0}
      >
        {isAssigning ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Gözləyin...
          </>
        ) : 'Təyin et'}
      </Button>
      
      {users.length > 0 && selectedUserId && (
        <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
          <h5 className="text-sm font-medium mb-2">Seçilmiş admin məlumatları:</h5>
          {users.filter(u => u.id === selectedUserId).map(user => (
            <div key={user.id} className="text-xs space-y-1">
              <p><strong>Ad:</strong> {user.first_name} {user.last_name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              {user.phone && <p><strong>Telefon:</strong> {user.phone}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
