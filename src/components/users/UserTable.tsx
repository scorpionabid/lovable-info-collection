
import UserTableContainer from "./table/UserTableContainer";
import { UserTableProps } from "./table/UserTable.props";

export const UserTable = ({ 
  users,
  totalCount,
  currentPage = 1,
  pageSize = 10,
  sortColumn = "first_name",
  sortDirection = "asc",
  isLoading = false,
  isError = false,
  selectedRows, 
  onSelectedRowsChange,
  onRefresh = () => {}, 
  onSortChange = () => {},
  onPageChange = () => {},
  onViewUser = () => {},
  onEditUser = () => {},
  onDeleteUser = () => {}
}: UserTableProps) => {
  return (
    <UserTableContainer
      users={users}
      totalCount={totalCount}
      currentPage={currentPage}
      pageSize={pageSize}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      isLoading={isLoading}
      isError={isError}
      selectedRows={selectedRows}
      onSelectedRowsChange={onSelectedRowsChange}
      onRefresh={onRefresh}
      onSortChange={onSortChange}
      onPageChange={onPageChange}
      onViewUser={onViewUser}
      onEditUser={onEditUser}
      onDeleteUser={onDeleteUser}
    />
  );
};

export default UserTable;
