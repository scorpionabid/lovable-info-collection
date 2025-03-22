
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserTableRowProps } from './UserTableRow.props';

const UserTableRow = ({ user, isSelected, onSelect, onView, onEdit, onDelete }: UserTableRowProps) => {
  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelect(user.id, e.target.checked);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Null check role to prevent runtime error
  const roleName = user.roles 
    ? (typeof user.roles === 'string' 
      ? user.roles 
      : user.roles.name || '') 
    : '';

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-2 py-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(user.id, checked as boolean)}
        />
      </td>
      <td className="px-4 py-3 flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary text-white">
            {getInitials(user.first_name, user.last_name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{user.first_name} {user.last_name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </td>
      <td className="px-4 py-3">{roleName}</td>
      <td className="px-4 py-3">{user.region_id || '-'}</td>
      <td className="px-4 py-3">{user.sector_id || '-'}</td>
      <td className="px-4 py-3">{user.school_id || '-'}</td>
      <td className="px-4 py-3">
        <Badge variant={user.is_active ? "success" : "destructive"}>
          {user.is_active ? 'Aktiv' : 'Deaktiv'}
        </Badge>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={onView}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete()}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default UserTableRow;
