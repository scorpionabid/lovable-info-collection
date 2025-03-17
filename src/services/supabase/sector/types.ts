
// Sector types
export interface Sector {
  id: string;
  name: string;
  description?: string;
  region_id: string;
  created_at: string;
}

export interface SectorWithStats extends Sector {
  regionName?: string;
  schoolCount: number;
  completionRate: number;
}

// Add the missing SectorData interface used in crudOperations.ts
export interface SectorData {
  name: string;
  description?: string;
  region_id: string;
}

// Pagination parameters
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// Sort parameters
export interface SortParams {
  column: string;
  direction: 'asc' | 'desc';
}

// Filter parameters
export interface FilterParams {
  searchQuery?: string;
  regionId?: string;
  dateFrom?: string;
  dateTo?: string;
  completionRate?: 'all' | 'high' | 'medium' | 'low';
}
