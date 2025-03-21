
import { type Tables, type TablesInsert, type TablesUpdate } from '@/integrations/supabase/types';

// Ümumi tiplər
export type Region = Tables<'regions'>;
export type Sector = Tables<'sectors'>;
export type School = Tables<'schools'>;
export type User = Tables<'users'>;
export type Role = Tables<'roles'>;
export type Category = Tables<'categories'>;
export type Column = Tables<'columns'>;

// DTO tiplər (yaratma)
export interface CreateRegionDto {
  name: string;
  code?: string;
  description?: string;
}

export interface CreateSectorDto {
  name: string;
  region_id: string;
  code?: string;
  description?: string;
}

export interface CreateSchoolDto {
  name: string;
  region_id: string;
  sector_id: string;
  type_id?: string;
  code?: string;
  address?: string;
  status?: string;
  director?: string;
  email?: string;
  phone?: string;
  student_count?: number;
  teacher_count?: number;
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
  is_active?: boolean;
  utis_code?: string;
  password?: string;
}

// DTO tiplər (yeniləmə)
export interface UpdateRegionDto {
  name?: string;
  code?: string;
  description?: string;
}

export interface UpdateSectorDto {
  name?: string;
  region_id?: string;
  code?: string;
  description?: string;
}

export interface UpdateSchoolDto {
  name?: string;
  region_id?: string;
  sector_id?: string;
  type_id?: string;
  code?: string;
  address?: string;
  status?: string;
  director?: string;
  email?: string;
  phone?: string;
  student_count?: number;
  teacher_count?: number;
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
  is_active?: boolean;
  utis_code?: string;
}

// Genişləndirilmiş tiplər
export interface RegionWithStats extends Region {
  sectorCount?: number;
  schoolCount?: number;
  completionRate?: number;
}

export interface SectorWithStats extends Sector {
  regionName?: string;
  schoolCount?: number;
  completionRate?: number;
}

export interface SchoolWithStats extends School {
  region?: string;
  sector?: string;
  completionRate?: number;
  adminName?: string;
  adminId?: string;
}

export interface UserWithRole extends User {
  roleName?: string;
}

// Filter tipləri
export interface FilterParams {
  search?: string;
  region_id?: string;
  sector_id?: string;
  status?: 'active' | 'inactive' | 'all';
  min_completion_rate?: number;
  max_completion_rate?: number;
  searchQuery?: string;
  dateFrom?: string;
  dateTo?: string;
  archived?: boolean;
  completionRate?: string;
  // Geriyə uyğunluq
  regionId?: string;
  sectorId?: string;
  type?: string;
  type_id?: string;
}

export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

// Notification tiplər
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

export interface CreateNotificationDto {
  title: string;
  body: string;
  notification_type: string;
  user_id: string;
  action_url?: string;
  data?: any;
}

export interface DbNotification {
  id: string;
  title: string;
  body: string;
  notification_type: string;
  user_id: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  action_url: string | null;
  data: any | null;
}

// Geriyə uyğunluq üçün interfeyslər
export interface SchoolType {
  id: string;
  name: string;
}
