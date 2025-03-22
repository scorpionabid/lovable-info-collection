
import { User } from "@/lib/supabase/types";

export interface UserTableProps {
  users: User[];
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  isLoading?: boolean;
  isError?: boolean;
  selectedRows?: string[];
  onSelectedRowsChange?: (rows: string[]) => void;
  onSortChange?: (column: string) => void;
  onPageChange?: (page: number) => void;
  onRefetch?: () => void; // Bu xəta verən prop
  onRefresh?: () => Promise<void>;
  onViewUser?: (user: User) => void;
  onEditUser?: (user: User) => void;
  onDeleteUser?: (userId: string) => void;
}
