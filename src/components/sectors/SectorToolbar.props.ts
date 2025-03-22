
export interface SectorToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
  onToggleFilters: () => void;
}
