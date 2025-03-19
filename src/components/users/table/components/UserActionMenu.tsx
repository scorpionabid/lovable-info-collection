
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash, Lock, CheckCircle, XCircle, MoreHorizontal } from "lucide-react";
import { User } from "@/services/userService";

interface UserActionMenuProps {
  user: User;
  onAction: (action: string, user: User) => void;
}

export const UserActionMenu = ({ user, onAction }: UserActionMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Əməliyyatlar</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onAction('view', user)}>
          <Eye className="mr-2 h-4 w-4" />
          <span>Bax</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAction('edit', user)}>
          <Edit className="mr-2 h-4 w-4" />
          <span>Redaktə et</span>
        </DropdownMenuItem>
        {user.is_active ? (
          <DropdownMenuItem onClick={() => onAction('block', user)}>
            <XCircle className="mr-2 h-4 w-4" />
            <span>Blokla</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => onAction('activate', user)}>
            <CheckCircle className="mr-2 h-4 w-4" />
            <span>Aktivləşdir</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => onAction('reset', user)}>
          <Lock className="mr-2 h-4 w-4" />
          <span>Şifrə sıfırla</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => onAction('delete', user)}
          className="text-red-600"
        >
          <Trash className="mr-2 h-4 w-4" />
          <span>Sil</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
