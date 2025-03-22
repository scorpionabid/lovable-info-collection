
import { UserTableContainer, UserTableContainerProps } from "./table/UserTableContainer";
import { User } from "@/lib/supabase/types/user";

// UserTableProps interfeysi burada UserTableContainerProps-dən genişləndirilir
interface UserTableProps extends Omit<UserTableContainerProps, 'selectedRows' | 'onSelectedRowsChange'> {
  selectedRows?: string[];
  onSelectedRowsChange?: (rows: string[]) => void;
}

export const UserTable = ({ 
  users, 
  selectedRows, 
  onSelectedRowsChange, 
  onRefresh,
  ...rest
}: UserTableProps) => {
  return (
    <UserTableContainer
      users={users}
      selectedRows={selectedRows}
      onSelectedRowsChange={onSelectedRowsChange}
      onRefresh={onRefresh}
      {...rest}
    />
  );
};

export default UserTable;
