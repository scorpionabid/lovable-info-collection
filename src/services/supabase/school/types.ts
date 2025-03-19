
import { Tables } from '@/integrations/supabase/types';

// Base School type
export type School = Tables<'schools'>;

export interface SchoolFilter {
  search?: string;
  region_id?: string;
  sector_id?: string;
  type_id?: string;
  status?: 'all' | 'active' | 'inactive';
  min_student_count?: number | string;
  max_student_count?: number | string;
}

export interface SchoolSortParams {
  field: string;
  direction: 'asc' | 'desc';
}

export interface SchoolPaginationParams {
  page: number;
  pageSize: number;
}

export interface SchoolWithStats extends School {
  student_count: number;
  teacher_count: number;
  status: 'active' | 'inactive';
  type: string;
  region: { name: string };
  sector: { name: string };
  director?: string;
  email?: string;
  phone?: string;
  completionRate: number;
  address?: string;
}

export interface CreateSchoolDto {
  name: string;
  sector_id: string;
  region_id?: string;
  type_id?: string;
  code?: string;
  address?: string;
}

export interface UpdateSchoolDto {
  name?: string;
  sector_id?: string;
  region_id?: string;
  type_id?: string;
  code?: string;
  address?: string;
  status?: 'active' | 'inactive';
}
