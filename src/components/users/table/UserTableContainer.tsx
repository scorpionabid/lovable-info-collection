
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { User } from "@/services/api/userService";
import { UserTableHeader } from "./UserTableHeader";
import { UserTableRow } from "./UserTableRow";
import { sortUsers } from "../utils/userUtils";
import { useToast } from "@/hooks/use-toast";
import userService from "@/services/api/userService";

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
  const { toast } = useToast();

  // Table actions
  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => userService.deleteUser(userId),
    onSuccess: () => {
      toast({
        title: "İstifadəçi silindi",
        description: "İstifadəçi uğurla silindi",
      });
      onRefetch();
    },
    onError: (error) => {
      toast({
        title: "Xəta baş verdi",
        description: `Silinmə xətası: ${(error as Error).message}`
      });
    }
  });

  const blockUserMutation = useMutation({
    mutationFn: (userId: string) => userService.blockUser(userId),
    onSuccess: () => {
      toast({
        title: "İstifadəçi bloklandı",
        description: "İstifadəçi uğurla bloklandı",
      });
      onRefetch();
    },
    onError: (error) => {
      toast({
        title: "Xəta baş verdi",
        description: `Bloklama xətası: ${(error as Error).message}`
      });
    }
  });

  const activateUserMutation = useMutation({
    mutationFn: (userId: string) => userService.activateUser(userId),
    onSuccess: () => {
      toast({
        title: "İstifadəçi aktivləşdirildi",
        description: "İstifadəçi uğurla aktivləşdirildi",
      });
      onRefetch();
    },
    onError: (error) => {
      toast({
        title: "Xəta baş verdi",
        description: `Aktivləşdirmə xətası: ${(error as Error).message}`
      });
    }
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (userId: string) => userService.resetPassword(userId),
    onSuccess: () => {
      toast({
        title: "Şifrə sıfırlandı",
        description: "Şifrə sıfırlama linki göndərildi",
      });
    },
    onError: (error) => {
      toast({
        title: "Xəta baş verdi",
        description: `Şifrə sıfırlama xətası: ${(error as Error).message}`
      });
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
              onDelete={deleteUserMutation.mutate}
              onBlock={blockUserMutation.mutate}
              onActivate={activateUserMutation.mutate}
              onResetPassword={resetPasswordMutation.mutate}
              onRefetch={onRefetch}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
