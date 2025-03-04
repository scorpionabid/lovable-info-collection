
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import userService, { UserFilters } from "@/services/api/userService";
import { UserTable } from "./UserTable";
import { UserModal } from "./UserModal";
import { UserFilterPanel } from "./UserFilterPanel";
import { UserHeader } from "./components/UserHeader";
import { SelectedUsersBar } from "./components/SelectedUsersBar";
import { UserLoadingState } from "./components/UserLoadingState";
import { EmptyUserState } from "./components/EmptyUserState";
import { UserErrorState } from "./components/UserErrorState";
import { useUserExport } from "./hooks/useUserExport";
import { useBulkActions } from "./hooks/useBulkActions";

export const UsersOverview = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<UserFilters>({});
  const { toast } = useToast();
  
  // Custom hooks
  const { exportUsers } = useUserExport();

  // Fetch users with react-query
  const { 
    data: users = [], 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['users', filters],
    queryFn: () => userService.getUsers({ ...filters, search: searchTerm }),
  });

  const { selectedRows, setSelectedRows, handleBulkAction } = useBulkActions(refetch);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleCreateUser = () => {
    setIsCreatingUser(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleApplyFilters = (newFilters: UserFilters) => {
    setFilters(newFilters);
    setShowFilters(false);
  };

  const handleImportUsers = () => {
    // This would typically open a file input dialog
    toast({
      title: "İstifadəçi idxalı",
      description: "İstifadəçi idxalı funksiyası hazırlanır",
    });
  };

  const handleExportUsers = () => {
    exportUsers(users);
  };

  if (isError && error) {
    return <UserErrorState error={error as Error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-4">
      <UserHeader 
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        onToggleFilters={toggleFilters}
        onImportUsers={handleImportUsers}
        onExportUsers={handleExportUsers}
        onCreateUser={handleCreateUser}
        isLoading={isLoading}
      />

      {showFilters && (
        <UserFilterPanel 
          onClose={() => setShowFilters(false)} 
          onApplyFilters={handleApplyFilters}
          currentFilters={filters}
        />
      )}

      <SelectedUsersBar 
        selectedCount={selectedRows.length}
        onBulkAction={handleBulkAction}
        onClearSelection={() => setSelectedRows([])}
      />

      {isLoading ? (
        <UserLoadingState />
      ) : users.length === 0 ? (
        <EmptyUserState />
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <UserTable 
            users={users} 
            onSelectedRowsChange={setSelectedRows} 
            selectedRows={selectedRows}
            onRefetch={refetch}
          />
        </div>
      )}

      {isCreatingUser && (
        <UserModal onClose={() => setIsCreatingUser(false)} onSuccess={() => refetch()} />
      )}
    </div>
  );
};
