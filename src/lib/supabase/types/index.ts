
// Export the shared utilities
export * from './shared';

// Export all types from the individual files
export type { Region, RegionWithStats, RegionFilters, CreateRegionDto, UpdateRegionDto } from './region';
export type { Sector, SectorWithStats, SectorFilters, CreateSectorDto, UpdateSectorDto } from './sector';
export type { School, SchoolType, SchoolFilter, SchoolSortParams, CreateSchoolDto, UpdateSchoolDto, SchoolWithStats } from './school';
export type { User, UserWithRole, UserFilters, CreateUserDto, UpdateUserDto, Role, UserRole, UserRoleClaims } from './user';
export type { CategoryAssignment, CategoryStatus, CategoryFilter, Category, CategoryColumn, CreateCategoryDto, UpdateCategoryDto, CreateColumnDto, UpdateColumnDto, CategoryStats, CategoryData, ExtendedColumnData } from './category';

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
  page?: number;
  pageSize?: number;
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
