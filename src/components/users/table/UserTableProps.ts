
import { User } from "@/lib/supabase/types";

export interface UserTableProps {
  users: User[];
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
  isLoading?: boolean;
  isError?: boolean;
  onSortChange?: (column: string) => void;
  setCurrentPage?: (page: number) => void;
  onEditUser?: (userId: string) => void;
  onViewUser?: (userId: string) => void;
  onDeleteUser?: (userId: string) => void;
  onRefetch?: () => void;
  
  // For selection
  selectedRows?: string[];
  onSelectedRowsChange?: (rows: string[]) => void;
}
