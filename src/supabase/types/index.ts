
// Re-export all types from the individual files
export * from './region';
export * from './sector';
export * from './school';
export * from './user';
export * from './database';

// Common interfaces used across multiple entity types
export interface FilterParams {
  search?: string;
  region_id?: string;
  sector_id?: string;
  status?: 'active' | 'inactive' | 'all' | 'archived';
  dateFrom?: string;
  dateTo?: string;
  min_completion_rate?: number;
  max_completion_rate?: number;
  searchQuery?: string;
  archived?: boolean;
  // For backward compatibility
  regionId?: string;
  sectorId?: string;
}

export interface SortParams {
  field?: string;
  column?: string;
  direction?: 'asc' | 'desc';
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  count: number;
}

// Type aliases for RegionFilters and other filter types
export type RegionFilters = FilterParams;
export type SectorFilters = FilterParams;
export type SchoolFilters = FilterParams;
export type UserFilters = FilterParams;
