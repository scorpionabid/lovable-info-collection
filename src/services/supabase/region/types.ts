
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
}

export interface RegionWithStats extends Region {
  sectors_count?: number;
  schools_count?: number;
  completion_rate?: number;
}

export interface FilterParams {
  name?: string;
  code?: string;
  status?: 'active' | 'archived';
}

export interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}
