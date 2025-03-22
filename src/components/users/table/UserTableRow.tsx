
import { cn } from "@/lib/utils";
import { User } from "@/lib/supabase/types/user";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2, UserCog } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface UserTableRowProps {
  user: User;
  isSelected: boolean;
  onSelectedChange: (selected: boolean) => void;
  onEdit?: (userId: string) => void;
  onDelete?: (userId: string) => void;
  onResetPassword?: (userId: string) => void;
}

export const UserTableRow = ({ 
  user, 
  isSelected, 
  onSelectedChange,
  onEdit,
  onDelete,
  onResetPassword
}: UserTableRowProps) => {
  const statusColor = user.is_active ? 'bg-green-500' : 'bg-red-500';
  // Null check əlavə et
  const roleName = user.role || user.roles?.name || "Naməlum";
  
  return (
    <tr className={cn("border-b transition-colors hover:bg-muted/50", isSelected && "bg-muted")}>
      <td className="p-2 pl-4">
        <Checkbox 
          checked={isSelected} 
          onCheckedChange={onSelectedChange} 
        />
      </td>
      <td className="p-2 whitespace-nowrap font-medium">{user.first_name} {user.last_name}</td>
      <td className="p-2 text-sm">{user.email}</td>
      <td className="p-2 text-sm">{user.phone || '-'}</td>
      <td className="p-2">
        <Badge variant="outline">{roleName}</Badge>
      </td>
      <td className="p-2 text-sm">
        <span className={`inline-block w-3 h-3 rounded-full ${statusColor} mr-2`}></span>
        {user.is_active ? 'Aktiv' : 'Deaktiv'}
      </td>
      <td className="p-2 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Menyu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Əməliyyatlar</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(user.id)}>
                <Pencil className="mr-2 h-4 w-4" />
                <span>Düzəliş et</span>
              </DropdownMenuItem>
            )}
            {onResetPassword && (
              <DropdownMenuItem onClick={() => onResetPassword(user.id)}>
                <UserCog className="mr-2 h-4 w-4" />
                <span>Şifrəni sıfırla</span>
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem 
                onClick={() => onDelete(user.id)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Sil</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
};
