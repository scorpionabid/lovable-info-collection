
import { MouseEventHandler } from "react";

export interface SectorToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onToggleFilters: () => void;
  onCreateClick: () => void; // Bu xəta verən prop
  isFilterActive?: boolean;
}
