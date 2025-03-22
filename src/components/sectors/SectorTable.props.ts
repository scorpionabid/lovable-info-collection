
import { Dispatch, SetStateAction } from "react";
import { SectorWithStats } from "@/lib/supabase/types";

export interface SectorTableProps {
  sectors: SectorWithStats[];
  isLoading: boolean;
  isError: boolean; // Bu xəta verən prop
  totalCount: number;
  currentPage: number;
  pageSize: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  onSortChange: (column: string) => void;
  onView?: (sectorId: string) => void;
  onEdit?: (sectorId: string) => void;
  onDelete?: (sectorId: string) => void;
  onRefresh: () => Promise<void>;
}
