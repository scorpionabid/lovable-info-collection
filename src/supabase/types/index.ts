
// Bütün tipler üçün mərkəzi fayl

// Export database types
export * from './database';

// Core entity types
export interface Region {
  id: string;
  name: string;
  code?: string;
  description: string;
  created_at: string;
  updated_at?: string;
}

export interface RegionWithStats extends Region {
  sectors_count?: number;
  schools_count?: number;
  completion_rate?: number;
  // Alternate naming for consistency
  sectorCount?: number;
  schoolCount?: number;
  completionRate?: number;
}

export interface Sector {
  id: string;
  name: string;
  region_id: string;
  description: string;
  created_at: string;
  updated_at?: string;
  archived: boolean;
}

export interface SectorWithStats extends Sector {
  schools_count?: number;
  completion_rate?: number;
  region?: { id: string; name: string };
  // Alternate naming for consistency
  schoolCount?: number;
  completionRate?: number;
  regionName?: string;
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
  region?: { id: string; name: string };
  sector?: { id: string; name: string };
  type?: { id: string; name: string };
  completionRate?: number;
  adminName?: string;
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
  avatar_url?: string;
}

export interface UserWithRole extends User {
  roles: Role;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface DataEntry {
  id: string;
  category_id: string;
  school_id: string;
  user_id: string;
  data: Record<string, any>;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submitted_at?: string;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at?: string;
}

export interface DataHistory {
  id: string;
  data_id: string;
  data: Record<string, any>;
  status: string;
  changed_by: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  is_read: boolean;
  link?: string;
  created_at: string;
  read_at?: string;
}

export interface DbNotification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  notification_type: string;
  is_read: boolean;
  action_url?: string;
  data?: any;
  created_at: string;
  read_at?: string;
}

export interface CreateNotificationDto {
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  link?: string;
}

// Filter, query and pagination interfaces
export interface FilterParams {
  search?: string;
  region_id?: string;
  sector_id?: string;
  status?: 'active' | 'archived' | 'all';
  dateFrom?: string;
  dateTo?: string;
  completionRate?: string;
  min_completion_rate?: number;
  max_completion_rate?: number;
  searchQuery?: string;
  archived?: boolean;
}

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
  // For compatibility with older code
  regionId?: string;
  sectorId?: string;
  sort_field?: string;
  sort_direction?: 'asc' | 'desc';
  sort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  type?: string;
}

export interface UserFilters {
  role_id?: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  search?: string;
  status?: 'active' | 'inactive' | 'blocked' | 'all';
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface SortParams {
  field?: string;
  column?: string;
  direction?: 'asc' | 'desc';
}

export interface SchoolSortParams {
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

// DTOs (Data Transfer Objects)
export interface LoginCredentials {
  email: string;
  password: string;
}

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
  code?: string;
}

export interface UpdateSectorDto {
  name?: string;
  region_id?: string;
  description?: string;
  archived?: boolean;
  code?: string;
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

// Results and utilities
export interface PaginatedResult<T> {
  data: T[];
  count: number;
}

export interface QueryResult<T> {
  data: T;
  count?: number;
  error: null | Error;
}

export interface ServiceError {
  message: string;
  code?: string;
  details?: any;
}

export interface ValidationError extends ServiceError {
  validationErrors: Record<string, string>;
}
