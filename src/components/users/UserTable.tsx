
import { UserTableContainer } from "./table/UserTableContainer";
import { User } from "@/services/userService";

interface UserTableProps {
  users: User[];
  selectedRows: string[];
  onSelectedRowsChange: (rows: string[]) => void;
  onRefetch: () => void;
}

export const UserTable = ({ 
  users, 
  selectedRows, 
  onSelectedRowsChange, 
  onRefetch 
}: UserTableProps) => {
  return (
    <UserTableContainer
      users={users}
      selectedRows={selectedRows}
      onSelectedRowsChange={onSelectedRowsChange}
      onRefetch={onRefetch}
    />
  );
};
