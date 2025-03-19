
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { User } from "@/services/userService";
import { UserTable } from '../UserTable';
import { BarLoader } from "react-spinners";
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UsersListProps {
  users: User[] | null;
  isLoading: boolean;
  error?: any;
  sortColumn: string | null;
  sortOrder: 'asc' | 'desc';
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onSort: (column: string) => void;
  onRetry?: () => void;
  selectedRows?: string[];
  onSelectedRowsChange?: (rows: string[]) => void;
  onRefetch?: () => void;
}

export const UsersList: React.FC<UsersListProps> = ({ 
  users, 
  isLoading, 
  error,
  sortColumn, 
  sortOrder, 
  onEditUser, 
  onDeleteUser, 
  onSort,
  onRetry,
  selectedRows = [],
  onSelectedRowsChange = () => {},
  onRefetch = () => {}
}) => {
  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-sm">
        <BarLoader color="#2563eb" width={150} />
        <p className="mt-4 text-infoline-dark-gray">İstifadəçilər yüklənir...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-sm text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Xəta baş verdi</h3>
        <p className="text-infoline-dark-gray mb-4">
          İstifadəçi məlumatları yüklənərkən xəta: {error.message || 'Bilinməyən xəta'}
        </p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            Yenidən cəhd edin
          </Button>
        )}
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-sm">
        <p className="text-infoline-dark-gray">İstifadəçilər tapılmadı</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <UserTable 
        users={users} 
        selectedRows={selectedRows}
        onSelectedRowsChange={onSelectedRowsChange}
        onRefetch={onRefetch}
      />
    </div>
  );
};
