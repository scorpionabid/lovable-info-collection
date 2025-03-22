
import { LucideIcon } from "lucide-react";

export interface UserTableHeaderProps {
  columns: { key: string; label: string }[];
  onSelectAll: () => void;
  allSelected: boolean;
  hasUsers?: boolean;
  onSort: (column: string) => void;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  getSortIcon: (column: string) => LucideIcon;
}
