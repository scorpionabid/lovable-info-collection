
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "@/services/api/userService";
import { UserIdentity } from "./components/UserIdentity";
import { UserRoleBadge } from "./components/UserRoleBadge";
import { UserStatusBadge } from "./components/UserStatusBadge";
import { UserLastLogin } from "./components/UserLastLogin";
import { UserActionMenu } from "./components/UserActionMenu";
import { getEntityName } from "./utils/userTableUtils";

interface UserTableRowProps {
  user: User;
  isSelected: boolean;
  onSelectRow: (id: string) => void;
  onDelete: (id: string) => void;
  onBlock: (id: string) => void;
  onActivate: (id: string) => void;
  onResetPassword: (id: string) => void;
  onRefetch: () => void;
}

export const UserTableRow = ({ 
  user, 
  isSelected, 
  onSelectRow, 
  onDelete,
  onBlock,
  onActivate,
  onResetPassword,
  onRefetch 
}: UserTableRowProps) => {
  
  const onAction = (action: string, user: User) => {
    switch(action) {
      case 'delete':
        onDelete(user.id);
        break;
      case 'block':
        onBlock(user.id);
        break;
      case 'activate':
        onActivate(user.id);
        break;
      case 'reset':
        onResetPassword(user.id);
        break;
      case 'view':
      case 'edit':
        // These are handled in the parent component
        break;
      default:
        console.error("Unknown action:", action);
    }
  };

  return (
    <tr className="hover:bg-infoline-lightest-gray transition-colors">
      <td className="px-4 py-3">
        <Checkbox 
          checked={isSelected} 
          onCheckedChange={() => onSelectRow(user.id)}
        />
      </td>
      <td className="px-4 py-3">
        <UserIdentity 
          firstName={user.first_name} 
          lastName={user.last_name} 
        />
      </td>
      <td className="px-4 py-3 text-infoline-dark-gray">
        {user.email}
      </td>
      <td className="px-4 py-3">
        <UserRoleBadge user={user} />
      </td>
      <td className="px-4 py-3 text-infoline-dark-gray">
        {getEntityName(user)}
      </td>
      <td className="px-4 py-3 text-infoline-dark-gray">
        <UserLastLogin dateString={user.last_login} />
      </td>
      <td className="px-4 py-3">
        <UserStatusBadge isActive={user.is_active} />
      </td>
      <td className="px-4 py-3 text-right">
        <UserActionMenu 
          user={user} 
          onAction={onAction} 
        />
      </td>
    </tr>
  );
};
