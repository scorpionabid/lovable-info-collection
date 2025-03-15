
import { User } from '@/services/api/userService';
import { sortUsers, getRoleName, getEntityName } from '../utils/userUtils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface UsersListProps {
  users: User[] | null;
  isLoading: boolean;
  sortColumn: string | null;
  sortOrder: 'asc' | 'desc';
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onSort: (column: string) => void;
}

export const UsersList = ({
  users,
  isLoading,
  sortColumn,
  sortOrder,
  onEditUser,
  onDeleteUser,
  onSort
}: UsersListProps) => {
  // Sort users based on current sort settings
  const sortedUsers = users ? sortUsers(users, sortColumn, sortOrder) : [];

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => onSort('name')} className="cursor-pointer">
              Ad Soyad
              {sortColumn === 'name' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
            </TableHead>
            <TableHead onClick={() => onSort('email')} className="cursor-pointer">
              Email
              {sortColumn === 'email' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
            </TableHead>
            <TableHead onClick={() => onSort('role')} className="cursor-pointer">
              Rol
              {sortColumn === 'role' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
            </TableHead>
            <TableHead onClick={() => onSort('entity')} className="cursor-pointer">
              Qurum
              {sortColumn === 'entity' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
            </TableHead>
            <TableHead onClick={() => onSort('lastActive')} className="cursor-pointer">
              Son aktivlik
              {sortColumn === 'lastActive' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
            </TableHead>
            <TableHead onClick={() => onSort('status')} className="cursor-pointer">
              Status
              {sortColumn === 'status' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
            </TableHead>
            <TableHead className="text-right">Əməliyyatlar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">Yüklənir...</TableCell>
            </TableRow>
          ) : sortedUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">Məlumat tapılmadı</TableCell>
            </TableRow>
          ) : (
            sortedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.first_name} {user.last_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{getRoleName(user)}</TableCell>
                <TableCell>{getEntityName(user)}</TableCell>
                <TableCell>{user.last_login ? new Date(user.last_login).toLocaleString() : 'Heç vaxt'}</TableCell>
                <TableCell>{user.is_active ? 'Aktiv' : 'Deaktiv'}</TableCell>
                <TableCell className="text-right">
                  <Button onClick={() => onEditUser(user)} variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                  <Button onClick={() => onDeleteUser(user)} variant="ghost" size="sm"><Trash2 className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
