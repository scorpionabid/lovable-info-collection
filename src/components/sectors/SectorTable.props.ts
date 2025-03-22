
import { SectorWithStats } from "@/lib/supabase/types/sector";
import { Dispatch, SetStateAction } from "react";

export interface SectorTableProps {
  sectors: SectorWithStats[];
  isLoading: boolean;
  isError: boolean;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  sortColumn: string;
  sortDirection: "asc" | "desc";
  onSortChange: (column: string) => void;
  onEdit: (sector: SectorWithStats) => void;
  onDelete: (sector: SectorWithStats) => void;
  onViewDetails: (sectorId: string) => void;
  onRefresh: () => void;
}
