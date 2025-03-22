
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
  onSortChange?: (column: string) => void;
  onPageChange?: (page: number) => void;
  onRefresh?: () => void;
  onViewUser?: (user: User) => void;
  onEditUser?: (user: User) => void;
  onDeleteUser?: (userId: string) => void;
  
  // For selection
  selectedRows?: string[];
  onSelectedRowsChange?: (rows: string[]) => void;
}
