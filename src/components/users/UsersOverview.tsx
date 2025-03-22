
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserTable } from './UserTable';
import { UserToolbar } from './toolbar/UserToolbar';
import { UserFilterPanel } from './filters/UserFilterPanel';
import { UserViewModal } from './modals/UserViewModal';
import { UserEditModal } from './modals/UserEditModal';
import { ConfirmDialog } from '../ui/confirm-dialog';
import { useUsers } from '@/hooks/useUsers';
import { useExportUsers } from '@/hooks/useExportUsers';
import { UserRole as UserRoleType } from '@/lib/supabase/types/user/role';
import { User } from '@/lib/supabase/types/user';

export const UsersOverview: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);
  
  const { exportToExcel, loading: isExporting } = useExportUsers();
  
  const {
    users,
    totalCount,
    isLoading,
    isError,
    currentPage,
    pageSize,
    sortColumn,
    sortDirection,
    filters,
    setCurrentPage,
    handleSortChange,
    handleFilterChange,
    refetch,
    deleteUser,
  } = useUsers();
  
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    handleFilterChange({ ...filters, search: value });
  };
  
  const handleAddUser = () => {
    navigate('/users/new');
  };
  
  const handleExportUsers = async () => {
    await exportToExcel(users, 'users-export.xlsx');
  };
  
  const handleOpenFilters = () => {
    setIsFilterPanelOpen(true);
  };
  
  const handleCloseFilters = () => {
    setIsFilterPanelOpen(false);
  };
  
  const handleApplyFilters = (newFilters: any) => {
    handleFilterChange({ ...filters, ...newFilters });
  };
  
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };
  
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };
  
  const handleDeleteUser = (userId: string) => {
    setUserIdToDelete(userId);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDeleteUser = async () => {
    if (userIdToDelete) {
      try {
        await deleteUser(userIdToDelete);
        refetch();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
    setIsDeleteDialogOpen(false);
    setUserIdToDelete(null);
  };
  
  return (
    <div className="container mx-auto py-8">
      <UserToolbar
        searchValue={searchQuery}
        onSearchChange={handleSearchChange}
        onAddUser={handleAddUser}
        onExportUsers={handleExportUsers}
        onOpenFilters={handleOpenFilters}
        isExporting={isExporting}
      />
      
      <UserFilterPanel
        isOpen={isFilterPanelOpen}
        onClose={handleCloseFilters}
        filters={filters}
        onApplyFilters={handleApplyFilters}
      />
      
      <div className="mt-6">
        <UserTable
          users={users}
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          isLoading={isLoading}
          isError={isError}
          onSortChange={handleSortChange}
          onPageChange={setCurrentPage}
          onRefetch={refetch}
          onViewUser={handleViewUser}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
        />
      </div>
      
      {selectedUser && (
        <>
          {isViewModalOpen && (
            <UserViewModal
              user={selectedUser}
              onClose={() => setIsViewModalOpen(false)}
            />
          )}
          
          {isEditModalOpen && (
            <UserEditModal
              user={selectedUser}
              onClose={() => setIsEditModalOpen(false)}
              onUserUpdated={() => {
                refetch();
                setIsEditModalOpen(false);
              }}
            />
          )}
        </>
      )}
      
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteUser}
      />
    </div>
  );
};

export default UsersOverview;
