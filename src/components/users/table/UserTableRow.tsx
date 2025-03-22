
import { User } from "@/lib/supabase/types/user";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { getUserRoleName, getUserEntity, getUserStatusBadge } from "../utils/userUtils";
import { EllipsisVertical, Eye, Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/utils/dateUtils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export interface UserTableRowProps {
  user: User;
  isSelected: boolean;
  onSelect: (userId: string, checked: boolean) => void;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const UserTableRow = ({ 
  user, 
  isSelected, 
  onSelect, 
  onView, 
  onEdit, 
  onDelete 
}: UserTableRowProps) => {
  const fullName = `${user.first_name} ${user.last_name}`;
  const roleName = getUserRoleName(user);
  const entity = getUserEntity(user);
  const lastLoginDate = user.last_login ? formatDate(user.last_login) : 'Heç vaxt';
  
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <td className="px-4 py-3">
        <Checkbox 
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(user.id, !!checked)}
        />
      </td>
      <td className="px-4 py-3">{fullName}</td>
      <td className="px-4 py-3">{user.email}</td>
      <td className="px-4 py-3">{roleName}</td>
      <td className="px-4 py-3">{entity}</td>
      <td className="px-4 py-3">{lastLoginDate}</td>
      <td className="px-4 py-3">
        {getUserStatusBadge(user.is_active)}
      </td>
      <td className="px-4 py-3 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <EllipsisVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onView} className="cursor-pointer">
              <Eye className="mr-2 h-4 w-4" />
              <span>Bax</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
              <Pencil className="mr-2 h-4 w-4" />
              <span>Redaktə et</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="cursor-pointer text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Sil</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
};

export default UserTableRow;
