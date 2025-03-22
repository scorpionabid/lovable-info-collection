
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { User } from '@/lib/supabase/types/user';
import { Badge } from '@/components/ui/badge';

interface UserTableRowProps {
  user: User;
  isSelected: boolean;
  onSelect: (userId: string, isSelected: boolean) => void;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

export const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  isSelected,
  onSelect,
  onView,
  onEdit,
  onDelete
}) => {
  const { id, first_name, last_name, email, role } = user;
  
  const roleName = typeof role === 'object' && role !== null ? role.name : typeof role === 'string' ? role : 'Unknown';
  
  // Formatlanmış tarix
  const formattedDate = user.created_at 
    ? new Date(user.created_at).toLocaleDateString() 
    : 'N/A';
  
  // İstifadəçinin statusu üçün badge rəngi
  const statusColor = user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  const statusText = user.is_active ? 'Aktiv' : 'Deaktiv';
  
  return (
    <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-800">
      <TableCell className="w-12">
        <Checkbox 
          checked={isSelected} 
          onCheckedChange={(checked) => onSelect(id, !!checked)} 
        />
      </TableCell>
      <TableCell className="font-medium">{first_name} {last_name}</TableCell>
      <TableCell>{email}</TableCell>
      <TableCell>{roleName}</TableCell>
      <TableCell>
        <Badge className={statusColor}>{statusText}</Badge>
      </TableCell>
      <TableCell>{formattedDate}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={() => onView(user)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onEdit(user)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-red-500" onClick={() => onDelete(id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default UserTableRow;
