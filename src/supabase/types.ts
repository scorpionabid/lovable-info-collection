
/**
 * Əsas tiplər və interfeyslər
 */

// Database tipi - Supabase-dən gələn tip
export type { Database } from '../integrations/supabase/types';

// JSON tipi
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Region interfeysi
export interface Region {
  id: string;
  name: string;
  code?: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}

// Statistika ilə genişləndirilmiş Region interfeysi
export interface RegionWithStats extends Region {
  sectorCount?: number;
  schoolCount?: number;
  studentCount?: number;
  teacherCount?: number;
  completionRate?: number;
  // Geriyə uyğunluq üçün
  sectors_count?: number;
  schools_count?: number;
  completion_rate?: number;
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
  code?: string;
  region_id: string;
  sector_id: string;
  type_id?: string;
  address?: string;
  director?: string;
  email?: string;
  phone?: string;
  student_count?: number;
  teacher_count?: number;
  status?: string;
  created_at: string;
  updated_at?: string;
  archived: boolean;
  // Virtual/derived fields
  completionRate?: number;
  type?: string;
  region?: string;
  sector?: string;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role_id?: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  utis_code?: string;
  is_active: boolean;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
  role?: string;
  userRole?: string;
}

export interface UserRoleClaims extends User {
  app_metadata?: {
    claims?: {
      roles?: string[] | string;
    }
  }
}

export interface LoginCredentials {
  email: string;
  password: string;
}

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
