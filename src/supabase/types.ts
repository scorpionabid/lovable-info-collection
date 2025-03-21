
/**
 * Supabase tip definisiyaları
 */
import { PostgrestFilterBuilder, PostgrestSingleResponse } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

// Re-export məlumatlar bazası tipləri
export type { Database };
export type SchemaName = 'public';
export type Tables = Database['public']['Tables'];
export type TablesInsert<T extends keyof Tables> = Tables[T]['Insert'];
export type TablesUpdate<T extends keyof Tables> = Tables[T]['Update'];
export type TablesRow<T extends keyof Tables> = Tables[T]['Row'];

// Əsas modellər

// Region tipi
export interface Region {
  id: string;
  name: string;
  code?: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}

// Region statistikası ilə
export interface RegionWithStats extends Region {
  sectors_count: number;
  schools_count: number;
  completion_rate?: number;
}

// Region sıralama və filtirləmə parametrləri
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

export interface RegionFilters {
  search?: string;
  status?: 'active' | 'archived' | 'all';
}

// Sektor tipi
export interface Sector {
  id: string;
  name: string;
  region_id: string;
  code?: string;
  description?: string;
  created_at: string;
  updated_at?: string;
  region?: string;
}

// Sektor statistikası ilə
export interface SectorWithStats extends Sector {
  schools_count: number;
  completion_rate?: number;
}

// Sektor filtirləmə parametrləri
export interface SectorFilters {
  search?: string;
  region_id?: string;
  status?: 'active' | 'archived' | 'all';
}

// Məktəb tipi
export interface School {
  id: string;
  name: string;
  code?: string;
  type_id?: string;
  type?: string;
  region_id: string;
  region?: string;
  sector_id: string;
  sector?: string;
  address?: string;
  director?: string;
  email?: string;
  phone?: string;
  student_count?: number;
  teacher_count?: number;
  status?: string;
  created_at: string;
  updated_at?: string;
  completionRate?: number;
}

// Məktəb filtirləmə və sıralama
export interface SchoolFilter {
  search?: string;
  region_id?: string | null;
  regionId?: string | null;
  sector_id?: string | null;
  sectorId?: string | null;
  type_id?: string | null;
  type?: string | null;
  status?: 'active' | 'archived' | 'all';
  sort_field?: string;
  sort_direction?: 'asc' | 'desc';
  sort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

export interface SchoolSortParams {
  field: string;
  direction: 'asc' | 'desc';
}

// Məktəb tipi
export interface SchoolType {
  id: string;
  name: string;
}

// İstifadəçi tipi
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role_id: string;
  is_active: boolean;
  region_id?: string | null;
  sector_id?: string | null;
  school_id?: string | null;
  phone?: string | null;
  utis_code?: string | null;
  created_at: string;
  updated_at?: string | null;
  last_login?: string | null;
  
  // Virtual fields
  roleName?: string;
  role?: any;
}

export interface UserWithRole extends User {
  role: {
    id: string;
    name: string;
    description?: string;
    permissions: string[];
  };
}

// İstifadəçi filtirləmə
export interface UserFilters {
  search?: string;
  role_id?: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  status?: 'active' | 'inactive' | 'all' | 'blocked';
}

// Sorğu modelləri
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
  code?: string;
  description?: string;
}

export interface UpdateSectorDto {
  name?: string;
  region_id?: string;
  code?: string;
  description?: string;
}

export interface CreateSchoolDto {
  name: string;
  sector_id: string;
  region_id: string;
  type_id?: string;
  code?: string;
  address?: string;
  phone?: string;
  email?: string;
  director?: string;
  student_count?: number;
  teacher_count?: number;
  status?: string;
}

export interface UpdateSchoolDto {
  name?: string;
  sector_id?: string;
  region_id?: string;
  type_id?: string;
  code?: string;
  address?: string;
  phone?: string;
  email?: string;
  director?: string;
  student_count?: number;
  teacher_count?: number;
  status?: string;
}

export interface CreateUserDto {
  email: string;
  first_name: string;
  last_name: string;
  role_id: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  phone?: string;
  utis_code?: string;
  password?: string;
  is_active?: boolean;
}

export interface UpdateUserDto {
  first_name?: string;
  last_name?: string;
  role_id?: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  phone?: string;
  utis_code?: string;
  is_active?: boolean;
}

// Generic error type for PostgreSQL
export interface PostgrestError {
  message: string;
  details: string;
  hint: string;
  code: string;
}

// Extend the PostgrestFilterBuilder interface
declare module '@supabase/supabase-js' {
  interface PostgrestFilterBuilder<Schema, Row, Result, RelationName, Relationships> {
    eq<T extends keyof Row>(column: T, value: Row[T]): PostgrestFilterBuilder<Schema, Row, Result, RelationName, Relationships>;
    neq<T extends keyof Row>(column: T, value: Row[T]): PostgrestFilterBuilder<Schema, Row, Result, RelationName, Relationships>;
    gt<T extends keyof Row>(column: T, value: Row[T]): PostgrestFilterBuilder<Schema, Row, Result, RelationName, Relationships>;
    gte<T extends keyof Row>(column: T, value: Row[T]): PostgrestFilterBuilder<Schema, Row, Result, RelationName, Relationships>;
    lt<T extends keyof Row>(column: T, value: Row[T]): PostgrestFilterBuilder<Schema, Row, Result, RelationName, Relationships>;
    lte<T extends keyof Row>(column: T, value: Row[T]): PostgrestFilterBuilder<Schema, Row, Result, RelationName, Relationships>;
    like<T extends keyof Row>(column: T, pattern: string): PostgrestFilterBuilder<Schema, Row, Result, RelationName, Relationships>;
    ilike<T extends keyof Row>(column: T, pattern: string): PostgrestFilterBuilder<Schema, Row, Result, RelationName, Relationships>;
    is<T extends keyof Row>(column: T, value: Row[T]): PostgrestFilterBuilder<Schema, Row, Result, RelationName, Relationships>;
    in<T extends keyof Row>(column: T, values: Row[T][]): PostgrestFilterBuilder<Schema, Row, Result, RelationName, Relationships>;
    contains<T extends keyof Row>(column: T, value: Row[T]): PostgrestFilterBuilder<Schema, Row, Result, RelationName, Relationships>;
    containedBy<T extends keyof Row>(column: T, value: Row[T]): PostgrestFilterBuilder<Schema, Row, Result, RelationName, Relationships>;
    filter<T extends keyof Row>(column: T, operator: string, value: Row[T]): PostgrestFilterBuilder<Schema, Row, Result, RelationName, Relationships>;
    or(filters: string): PostgrestFilterBuilder<Schema, Row, Result, RelationName, Relationships>;
    match(query: Record<string, unknown>): PostgrestFilterBuilder<Schema, Row, Result, RelationName, Relationships>;
  }
}
