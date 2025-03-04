
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserTableHeader } from "./UserTableHeader";
import { UserTableRow } from "./UserTableRow";
import { UserViewModal } from "../UserViewModal";
import { UserModal } from "../UserModal";
import { User } from "@/services/api/userService";
import userService from "@/services/api/userService";
import { sortUsers } from "../utils/userUtils";

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
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);

  // Mutations
  const blockUserMutation = useMutation({
    mutationFn: (userId: string) => userService.blockUser(userId),
    onSuccess: () => {
      toast("İstifadəçi bloklandı", {
        description: "İstifadəçi uğurla bloklandı",
      });
      onRefetch();
    },
    onError: (error) => {
      toast("Xəta baş verdi", {
        description: `İstifadəçini bloklamaq mümkün olmadı: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  });

  const activateUserMutation = useMutation({
    mutationFn: (userId: string) => userService.activateUser(userId),
    onSuccess: () => {
      toast("İstifadəçi aktivləşdirildi", {
        description: "İstifadəçi uğurla aktivləşdirildi",
      });
      onRefetch();
    },
    onError: (error) => {
      toast("Xəta baş verdi", {
        description: `İstifadəçini aktivləşdirmək mümkün olmadı: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => userService.deleteUser(userId),
    onSuccess: () => {
      toast("İstifadəçi silindi", {
        description: "İstifadəçi uğurla silindi",
        variant: "destructive",
      });
      onRefetch();
    },
    onError: (error) => {
      toast("Xəta baş verdi", {
        description: `İstifadəçini silmək mümkün olmadı: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedRows.length === users.length) {
      onSelectedRowsChange([]);
    } else {
      onSelectedRowsChange(users.map(user => user.id));
    }
  };

  const handleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      onSelectedRowsChange(selectedRows.filter(rowId => rowId !== id));
    } else {
      onSelectedRowsChange([...selectedRows, id]);
    }
  };

  const handleAction = (action: string, user: User) => {
    switch (action) {
      case 'view':
        setViewUser(user);
        break;
      case 'edit':
        setEditUser(user);
        break;
      case 'block':
        blockUserMutation.mutate(user.id);
        break;
      case 'activate':
        activateUserMutation.mutate(user.id);
        break;
      case 'reset':
        // This would typically call a password reset function
        toast("Şifrə sıfırlandı", {
          description: `${user.first_name} ${user.last_name} üçün şifrə sıfırlama e-poçtu göndərildi`,
        });
        break;
      case 'delete':
        if (window.confirm(`${user.first_name} ${user.last_name} istifadəçisini silmək istədiyinizə əminsinizmi?`)) {
          deleteUserMutation.mutate(user.id);
        }
        break;
      default:
        break;
    }
  };

  // Sort users based on current sort settings
  const sortedUsers = sortUsers(users, sortField, sortDirection);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <UserTableHeader
            onSelectAll={handleSelectAll}
            allSelected={selectedRows.length === users.length}
            hasUsers={users.length > 0}
            onSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
          />
          <tbody className="divide-y divide-infoline-light-gray">
            {sortedUsers.map(user => (
              <UserTableRow
                key={user.id}
                user={user}
                isSelected={selectedRows.includes(user.id)}
                onSelectRow={handleSelectRow}
                onAction={handleAction}
              />
            ))}
          </tbody>
        </table>
      </div>

      {viewUser && (
        <UserViewModal user={viewUser} onClose={() => setViewUser(null)} />
      )}

      {editUser && (
        <UserModal 
          user={editUser} 
          onClose={() => setEditUser(null)} 
          onSuccess={() => {
            onRefetch();
            setEditUser(null);
          }}
        />
      )}
    </>
  );
};
