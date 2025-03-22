
import { LucideIcon } from "lucide-react";

export interface UserTableHeaderProps {
  columns: { key: string; label: string }[];
  onSelectAll: () => void;
  allSelected: boolean;
  onSort: (column: string) => void;
  getSortIcon: (column: string) => LucideIcon;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
}
