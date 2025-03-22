
// Bütün tip modullarını bir mərkəzi nöqtədən ixrac edirik
export * from './region';
export * from './sector';
export * from './school';
export type { User, Role, UserFilters, UserStatus, CreateUserDto, UpdateUserDto, UserRoleClaims } from './user';
export * from './data';
export * from './notification';
export * from '../types-util';
export * from './shared';

// Ümumi interfeyslər çoxsaylı entity tipləri üçün istifadə olunur
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
  // Filter parameters for users
  role?: string;
  role_id?: string;
  school_id?: string;
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

// RegionFilters və digər filter tipləri üçün tip aliasları
export type RegionFilters = FilterParams;
export type SectorFilters = FilterParams;
export type SchoolFilters = FilterParams;
export type UserFilters = FilterParams;
