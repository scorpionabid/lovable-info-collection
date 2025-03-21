
// Database Tables
export interface Region {
  id: string;
  name: string;
  code?: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}

export interface Sector {
  id: string;
  name: string;
  region_id: string;
  description?: string;
  archived?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface School {
  id: string;
  name: string;
  address: string;
  region_id: string;
  sector_id: string;
  type_id: string;
  code?: string;
  status: string;
  director: string;
  email: string;
  phone: string;
  student_count: number;
  teacher_count: number;
  archived: boolean;
  created_at: string;
  updated_at?: string;
}

export interface SchoolType {
  id: string;
  name: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  scope: 'global' | 'region' | 'sector' | 'school';
  scope_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CategoryColumn {
  id: string;
  name: string;
  type: string;
  required: boolean;
  description?: string;
  options?: string[] | null;
  category_id: string;
  order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role_id: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  utis_code?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
  roles?: Role; // Relationship field
  region?: Region; // Relationship field
  sector?: Sector; // Relationship field
  school?: School; // Relationship field
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

// DTOs (Data Transfer Objects)
export interface CreateRegionDto {
  name: string;
  code?: string;
  description?: string;
}

export interface UpdateRegionDto {
  name?: string;
  code?: string;
  description?: string;
}

export interface CreateSectorDto {
  name: string;
  region_id: string;
  description?: string;
}

export interface UpdateSectorDto {
  name?: string;
  region_id?: string;
  description?: string;
  archived?: boolean;
}

export interface CreateSchoolDto {
  name: string;
  address?: string;
  region_id: string;
  sector_id: string;
  type_id?: string;
  code?: string;
  status?: string;
  director?: string;
  email?: string;
  phone?: string;
  student_count?: number;
  teacher_count?: number;
}

export interface UpdateSchoolDto {
  name?: string;
  address?: string;
  region_id?: string;
  sector_id?: string;
  type_id?: string;
  code?: string;
  status?: string;
  director?: string;
  email?: string;
  phone?: string;
  student_count?: number;
  teacher_count?: number;
  archived?: boolean;
}

export interface CreateUserDto {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role_id: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  utis_code?: string;
  is_active?: boolean;
  password?: string;
}

export interface UpdateUserDto {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  role_id?: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  utis_code?: string;
  is_active?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Filter interfaces
export interface RegionFilters {
  search?: string;
  status?: 'active' | 'archived' | 'all';
}

export interface SectorFilters {
  region_id?: string;
  search?: string;
  status?: 'active' | 'archived' | 'all';
}

export interface SchoolFilter {
  region_id?: string;
  sector_id?: string;
  type_id?: string;
  search?: string;
  status?: 'active' | 'archived' | 'all';
}

export interface UserFilters {
  role_id?: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  search?: string;
  status?: 'active' | 'inactive' | 'all';
}

// Pagination and sorting interfaces
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface SchoolSortParams {
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

// Enhanced types with stats
export interface RegionWithStats extends Region {
  sectors_count: number;
  schools_count: number;
  completion_rate: number;
}

export interface SectorWithStats extends Sector {
  schools_count: number;
  completion_rate: number;
  region?: { id: string; name: string };
}

export interface SchoolWithStats extends School {
  completionRate: number;
  region?: { id: string; name: string };
  sector?: { id: string; name: string };
  type?: { id: string; name: string };
  adminName?: string;
}

// Results interfaces
export interface PaginatedResult<T> {
  data: T[];
  count: number;
}

// Error interfaces
export interface ServiceError {
  message: string;
  code?: string;
  details?: any;
}

export interface ValidationError extends ServiceError {
  validationErrors: Record<string, string>;
}

// Utility types
export type QueryResult<T> = Promise<{ data: T; error: ServiceError | null }>;
export type ListQueryResult<T> = Promise<{ data: T[]; error: ServiceError | null }>;
export type PaginatedQueryResult<T> = Promise<{ data: T[]; count: number; error: ServiceError | null }>;
