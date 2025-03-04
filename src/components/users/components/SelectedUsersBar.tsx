
import React from "react";
import { Users as UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { UserX, CheckCircle, Lock, Trash } from "lucide-react";

interface SelectedUsersBarProps {
  selectedCount: number;
  onBulkAction: (action: string) => void;
  onClearSelection: () => void;
}

export const SelectedUsersBar = ({
  selectedCount,
  onBulkAction,
  onClearSelection
}: SelectedUsersBarProps) => {
  if (selectedCount === 0) return null;
  
  return (
    <div className="bg-infoline-light-blue/10 p-3 rounded-lg border border-infoline-light-blue flex items-center justify-between">
      <div className="flex items-center gap-2">
        <UsersIcon size={16} className="text-infoline-blue" />
        <span className="text-sm font-medium">{selectedCount} istifadəçi seçilib</span>
      </div>
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <span>Çoxlu əməliyyat</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Çoxlu əməliyyatlar</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onBulkAction("Blokla")}>
              <UserX className="mr-2 h-4 w-4" />
              <span>Blokla</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onBulkAction("Aktivləşdir")}>
              <CheckCircle className="mr-2 h-4 w-4" />
              <span>Aktivləşdir</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onBulkAction("Şifrə sıfırla")}>
              <Lock className="mr-2 h-4 w-4" />
              <span>Şifrə sıfırla</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onBulkAction("Sil")} className="text-red-600">
              <Trash className="mr-2 h-4 w-4" />
              <span>Sil</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={onClearSelection}
        >
          <span>Seçimi təmizlə</span>
        </Button>
      </div>
    </div>
  );
};
