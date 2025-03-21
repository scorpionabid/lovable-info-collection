
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { User } from "@/services/userService";
import { UserTableHeader } from "./UserTableHeader";
import { UserTableRow } from "./UserTableRow";
import { toast } from "sonner";
import userService from "@/services/userService";

interface UserTableContainerProps {
  users: User[];
  selectedRows: string[];
  onSelectedRowsChange: (rows: string[]) => void;
  onRefetch: () => void;
}

export const UserTableContainer = ({ 
  users, 
  selectedRows, 
  onSelectedRowsChange,
  onRefetch
}: UserTableContainerProps) => {
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Table actions
  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => userService.deleteUser(userId),
    onSuccess: () => {
      toast.success("İstifadəçi uğurla silindi");
      onRefetch();
    },
    onError: (error) => {
      toast.error(`Silinmə xətası: ${(error as Error).message}`);
    }
  });

  const blockUserMutation = useMutation({
    mutationFn: (userId: string) => userService.blockUser(userId),
    onSuccess: () => {
      toast.success("İstifadəçi uğurla bloklandı");
      onRefetch();
    },
    onError: (error) => {
      toast.error(`Bloklama xətası: ${(error as Error).message}`);
    }
  });

  const activateUserMutation = useMutation({
    mutationFn: (userId: string) => userService.activateUser(userId),
    onSuccess: () => {
      toast.success("İstifadəçi uğurla aktivləşdirildi");
      onRefetch();
    },
    onError: (error) => {
      toast.error(`Aktivləşdirmə xətası: ${(error as Error).message}`);
    }
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (userId: string) => userService.resetPassword(userId),
    onSuccess: () => {
      toast.success("Şifrə sıfırlama linki göndərildi");
    },
    onError: (error) => {
      toast.error(`Şifrə sıfırlama xətası: ${(error as Error).message}`);
    }
  });

  // Sorting logic
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Manual sorting implementation
  const sortUsers = (users: User[], field: string | null, direction: 'asc' | 'desc') => {
    if (!field) return users;
    
    return [...users].sort((a, b) => {
      let valueA, valueB;
      
      switch (field) {
        case 'name':
          valueA = `${a.first_name} ${a.last_name}`.toLowerCase();
          valueB = `${b.first_name} ${b.last_name}`.toLowerCase();
          break;
        case 'email':
          valueA = a.email.toLowerCase();
          valueB = b.email.toLowerCase();
          break;
        case 'role':
          valueA = a.roles?.name || '';
          valueB = b.roles?.name || '';
          break;
        case 'lastLogin':
          valueA = a.last_login || '';
          valueB = b.last_login || '';
          break;
        case 'status':
          valueA = a.is_active ? 'active' : 'inactive';
          valueB = b.is_active ? 'active' : 'inactive';
          break;
        default:
          return 0;
      }
      
      if (valueA < valueB) return direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const sortedUsers = sortUsers(users, sortField, sortDirection);

  // Select/deselect all rows
  const handleSelectAll = () => {
    if (selectedRows.length === users.length) {
      onSelectedRowsChange([]);
    } else {
      onSelectedRowsChange(users.map(user => user.id));
    }
  };

  // Handle individual row selection
  const handleSelectRow = (userId: string) => {
    if (selectedRows.includes(userId)) {
      onSelectedRowsChange(selectedRows.filter(id => id !== userId));
    } else {
      onSelectedRowsChange([...selectedRows, userId]);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <UserTableHeader 
          onSelectAll={handleSelectAll}
          allSelected={selectedRows.length === users.length && users.length > 0}
          hasUsers={users.length > 0}
          onSort={handleSort}
          sortField={sortField}
          sortDirection={sortDirection}
        />
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedUsers.map((user) => (
            <UserTableRow 
              key={user.id} 
              user={user}
              isSelected={selectedRows.includes(user.id)}
              onSelectRow={handleSelectRow}
              onDelete={(id) => deleteUserMutation.mutate(id)}
              onBlock={(id) => blockUserMutation.mutate(id)}
              onActivate={(id) => activateUserMutation.mutate(id)}
              onResetPassword={(id) => resetPasswordMutation.mutate(id)}
              onRefetch={onRefetch}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
