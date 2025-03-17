
// Types for sector service

// Base sector data type for create/update operations
export interface SectorData {
  name: string;
  description?: string | null;
  region_id: string;
  is_active?: boolean;
  archived?: boolean;
}

// Extended sector type with additional fields from database
export interface Sector extends SectorData {
  id: string;
  created_at: string;
  updated_at?: string;
  regions?: {
    id: string;
    name: string;
  } | null;
}

// Sector with additional statistics for UI display
export interface SectorWithStats extends Sector {
  regionName: string;
  schoolCount: number;
  completionRate: number;
}

// Parameters for filtering sectors
export interface FilterParams {
  searchQuery?: string;
  regionId?: string;
  dateFrom?: string;
  dateTo?: string;
  completionRate?: 'all' | 'high' | 'medium' | 'low';
}

// Parameters for pagination
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// Parameters for sorting
export interface SortParams {
  column: string;
  direction: 'asc' | 'desc';
}
