
// Define types for the region module
export interface Region {
  id: string;
  name: string;
  code?: string;
  description?: string;
  created_at: string;
  updated_at?: string;
  archived?: boolean;
}

export interface Sector {
  id: string;
  name: string;
  code?: string;
  description?: string;
  region_id: string;
  created_at: string;
  updated_at?: string;
  archived?: boolean;
  // Add fields needed for the UI components - making them optional to avoid type conflicts
  schoolCount?: number;
  completionRate?: number;
  // DB field names
  schools_count?: number;
  completion_rate?: number;
}

export interface RegionWithStats extends Region {
  // DB field names
  sectors_count?: number;
  schools_count?: number;
  completion_rate?: number;
  userCount?: number;
  // UI field names for backward compatibility
  sectorCount?: number;
  schoolCount?: number;
  completionRate?: number;
}

export interface FilterParams {
  name?: string;
  code?: string;
  status?: 'active' | 'archived';
  // Add additional filter params needed by components
  searchQuery?: string;
  dateFrom?: string;
  dateTo?: string;
  completionRate?: string;
}

export interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

// Add SortParams for getRegions
export interface SortParams {
  column: string;
  direction: 'asc' | 'desc';
}
