
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { UsersList } from './components/UsersList';
import { UserTableToolbar } from "./table/UserTableToolbar";
import { UserTablePagination } from "./table/UserTablePagination";
import { UserForm } from "./modals/UserForm";
import { useUserExport } from "./hooks/useUserExport";
import { useUsersData } from './hooks/useUsersData';
import { useUserFormHandling } from './hooks/useUserFormHandling';
import { toast } from "sonner";
import { BulkActionsBar } from './components/BulkActionsBar';
import { useLogger } from '@/hooks/useLogger';

export const UsersOverview = () => {
  const navigate = useNavigate();
  const { exportUsers } = useUserExport();
  const logger = useLogger('UsersOverview');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  
  // Use our custom hook for user data and state management
  const {
    users,
    totalItems,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    searchTerm,
    setSearchTerm,
    sortBy,
    sortOrder: currentSortOrder,
    setSortBy,
    setSortOrder,
    refetch,
  } = useUsersData();

  // Use our custom hook for form handling
  const {
    isFormOpen,
    selectedUser,
    handleAddUser,
    handleEdit,
    handleDelete,
    handleFormSuccess,
    setIsFormOpen
  } = useUserFormHandling(refetch);

  const handleExport = () => {
    if (!users || users.length === 0) {
      toast.error("İxrac etmək üçün məlumat tapılmadı");
      return;
    }
    
    logger.info('Exporting users data', { count: users.length });
    exportUsers(users);
    toast.success("İstifadəçilər uğurla ixrac edildi");
  };

  const handleBulkAction = (action: string) => {
    if (selectedRows.length === 0) {
      toast.warning("Əməliyyat üçün istifadəçi seçilməyib");
      return;
    }

    logger.info('Bulk action triggered', { action, selectedCount: selectedRows.length });
    
    // Handle different bulk actions
    switch (action) {
      case 'delete':
        // Implement bulk delete
        toast.info(`${selectedRows.length} istifadəçi silmək üçün hazırlanır...`);
        // Actual implementation would go here
        break;
      case 'activate':
        // Implement bulk activate
        toast.info(`${selectedRows.length} istifadəçi aktivləşdirilir...`);
        // Actual implementation would go here
        break;
      case 'deactivate':
        // Implement bulk deactivate
        toast.info(`${selectedRows.length} istifadəçi deaktivləşdirilir...`);
        // Actual implementation would go here
        break;
      default:
        toast.error("Naməlum əməliyyat");
    }
  };

  // Adapter function to convert string to event handler
  const handleSearchInputChange = (value: string) => {
    setSearchTerm(value);
  };

  // Handle sort changes
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(currentSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">İstifadəçilər</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/users/import')}>
            İdxal et
          </Button>
          <Button onClick={handleAddUser}>
            Yeni İstifadəçi
          </Button>
        </div>
      </div>

      <UserTableToolbar 
        search={searchTerm}
        onSearchChange={handleSearchInputChange}
        onExport={handleExport}
        onAddUser={handleAddUser}
      />

      {selectedRows.length > 0 && (
        <BulkActionsBar 
          selectedCount={selectedRows.length}
          onClearSelection={() => setSelectedRows([])}
          onAction={handleBulkAction}
        />
      )}

      <UsersList
        users={users}
        isLoading={false}
        sortColumn={sortBy}
        sortOrder={currentSortOrder}
        onEditUser={handleEdit}
        onDeleteUser={handleDelete}
        onSort={handleSort}
        onRetry={refetch}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
        onRefetch={refetch}
      />

      <UserTablePagination
        page={currentPage}
        perPage={itemsPerPage}
        totalItems={totalItems}
        setPage={setCurrentPage}
        setPerPage={setItemsPerPage}
      />

      <UserForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
        user={selectedUser}
      />
    </div>
  );
};
