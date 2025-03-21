
import React, { useState } from 'react';
import { User } from '@/lib/supabase/types/user';
import { UserTableHeader } from './UserTableHeader';
import { UserTableRow } from './UserTableRow';
import { Button } from '@/components/ui/button';
import { useUserTable } from '../hooks/useUserTable';
import { Pagination } from '@/components/ui/pagination';
import { LucideIcon } from 'lucide-react';

export interface UserTableContainerProps {
  users: User[];
  totalCount?: number;
  currentPage: number;
  pageSize: number;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  isLoading: boolean;
  isError: boolean;
  onSortChange: (column: string) => void;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
  onViewUser: (user: User) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  selectedRows?: string[];
  onSelectedRowsChange?: (rows: string[]) => void;
}

export const UserTableContainer: React.FC<UserTableContainerProps> = ({
  users,
  totalCount = 0,
  currentPage,
  pageSize,
  sortColumn,
  sortDirection,
  isLoading,
  isError,
  onSortChange,
  onPageChange,
  onRefresh,
  onViewUser,
  onEditUser,
  onDeleteUser,
  selectedRows: externalSelectedRows,
  onSelectedRowsChange,
}) => {
  const { columns, getSortIcon } = useUserTable();
  const [internalSelectedUsers, setInternalSelectedUsers] = useState<string[]>([]);
  
  const selectedUsers = externalSelectedRows || internalSelectedUsers;
  const setSelectedUsers = onSelectedRowsChange || setInternalSelectedUsers;

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.id));
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const renderEmptyState = () => (
    <tr>
      <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-gray-500">
        {isError ? (
          <div>
            <p>İstifadəçiləri yüklərkən xəta baş verdi.</p>
            <Button variant="outline" size="sm" onClick={onRefresh} className="mt-2">
              Yenidən cəhd edin
            </Button>
          </div>
        ) : (
          'İstifadəçi tapılmadı.'
        )}
      </td>
    </tr>
  );

  const renderLoadingState = () => (
    <tr>
      <td colSpan={columns.length + 1} className="px-6 py-4 text-center">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2">Yüklənir...</span>
        </div>
      </td>
    </tr>
  );

  // Render pagination controls
  const renderPagination = () => {
    const totalPages = Math.ceil(totalCount / pageSize);
    
    if (totalPages <= 1) return null;
    
    return (
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    );
  };

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <UserTableHeader 
          columns={columns}
          sortField={sortColumn}
          sortDirection={sortDirection}
          onSelectAll={handleSelectAll}
          allSelected={users.length > 0 && selectedUsers.length === users.length}
          onSort={onSortChange}
          getSortIcon={getSortIcon as (column: string) => LucideIcon}
          hasUsers={users.length > 0}
        />
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
          {isLoading ? (
            renderLoadingState()
          ) : users.length === 0 ? (
            renderEmptyState()
          ) : (
            users.map(user => (
              <UserTableRow
                key={user.id}
                user={user}
                isSelected={selectedUsers.includes(user.id)}
                onSelect={handleSelectUser}
                onView={() => onViewUser(user)}
                onEdit={() => onEditUser(user)}
                onDelete={() => onDeleteUser(user.id)}
              />
            ))
          )}
        </tbody>
      </table>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {renderPagination()}
      </div>
    </div>
  );
};

export default UserTableContainer;
