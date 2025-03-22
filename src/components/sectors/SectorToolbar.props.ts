
import { MouseEventHandler } from "react";

export interface SectorToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onToggleFilters: () => void;
  onCreateClick: () => void;
  isFilterActive?: boolean;
}
