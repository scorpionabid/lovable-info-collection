
import { RegionWithStats } from "@/lib/supabase/types/region";
import { Dispatch, SetStateAction } from "react";
import { RefetchOptions } from "@tanstack/react-query";

export interface RegionTableProps {
  regions: RegionWithStats[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  sortColumn: string;
  sortDirection: "asc" | "desc";
  onSortChange: (column: string) => void;
  isLoading: boolean;
  isError: boolean;
  onViewRegion?: (region: RegionWithStats) => void;
  onEditRegion?: (region: RegionWithStats) => void;
  onDeleteRegion?: (regionId: string) => void;
  onRefresh?: (options?: RefetchOptions) => Promise<any>;
}
