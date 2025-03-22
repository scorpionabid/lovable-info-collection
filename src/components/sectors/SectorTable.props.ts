
import { SectorWithStats } from "@/lib/supabase/types";
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
  onRefresh: () => Promise<void>;
}
