
import React from 'react';
import { User } from '@/lib/supabase/types/user';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { UserRoleBadge } from './components/UserRoleBadge';
import { formatDate } from '@/lib/utils';

export interface UserTableRowProps {
  user: User;
  isSelected: boolean;
  onSelect: (userId: string, checked: boolean) => void;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  isSelected,
  onSelect,
  onView,
  onEdit,
  onDelete
}) => {
  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelect(user.id, e.target.checked);
  };

  // Format user's full name
  const fullName = `${user.first_name} ${user.last_name}`;

  // Get entity based on user's role
  const getEntityDisplay = () => {
    if (user.region) {
      return `Region: ${user.region}`;
    } else if (user.sector) {
      return `Sektor: ${user.sector}`;
    } else if (user.school) {
      return `Məktəb: ${user.school}`;
    }
    return '-';
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
      <td className="px-4 py-4 whitespace-nowrap">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(user.id, !!checked)}
          aria-label={`Select ${fullName}`}
          className="h-4 w-4"
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">{fullName}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{user.utis_code || '-'}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-white">{user.email}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{user.phone || '-'}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <UserRoleBadge user={user} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {getEntityDisplay()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {user.last_login ? formatDate(user.last_login) : 'Heç vaxt'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          user.is_active 
            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
            : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
        }`}>
          {user.is_active ? 'Aktiv' : 'Deaktiv'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Button onClick={onView} variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
          <Eye className="w-4 h-4" />
        </Button>
        <Button onClick={onEdit} variant="ghost" size="sm" className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
          <Pencil className="w-4 h-4" />
        </Button>
        <Button onClick={onDelete} variant="ghost" size="sm" className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
          <Trash2 className="w-4 h-4" />
        </Button>
      </td>
    </tr>
  );
};

export default UserTableRow;
