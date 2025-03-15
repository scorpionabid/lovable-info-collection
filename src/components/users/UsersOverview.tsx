
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

export const UsersOverview = () => {
  const navigate = useNavigate();
  const { exportUsers } = useUserExport();
  
  // Use our custom hook for user data and state management
  const {
    users,
    isLoading,
    page,
    perPage,
    search,
    sortColumn,
    sortOrder,
    usersData,
    refetch,
    handleSearchChange,
    handleSort,
    setPage,
    setPerPage,
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
    if (!users) {
      toast("İxrac etmək üçün məlumat tapılmadı");
      return;
    }
    exportUsers(users as any);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">İstifadəçilər</h1>
        <Button onClick={() => navigate('/users/import')}>Import</Button>
      </div>

      <UserTableToolbar 
        search={search}
        onSearchChange={handleSearchChange}
        onExport={handleExport}
        onAddUser={handleAddUser}
      />

      <UsersList
        users={users}
        isLoading={isLoading}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        onEditUser={handleEdit}
        onDeleteUser={handleDelete}
        onSort={handleSort}
      />

      <UserTablePagination
        page={page}
        perPage={perPage}
        totalItems={(usersData as any)?.count || 0}
        setPage={setPage}
        setPerPage={setPerPage}
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
