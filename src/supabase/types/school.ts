
import { Tables } from '@/types/supabase';

// School type interface with archived as optional to match the service usages
export type School = Omit<Tables<'schools'>, 'archived'> & {
  archived?: boolean;
  completionRate?: number;
  adminName?: string;
  adminId?: string;
  region?: string;
  sector?: string;
  type?: string;
};

// School with Statistics
export interface SchoolWithStats extends School {
  completionRate?: number;
  adminName?: string;
  adminId?: string;
}

// School type definition
export interface SchoolType {
  id: string;
  name: string;
  description?: string;
}

// School filter interface
export interface SchoolFilter {
  search?: string;
  region_id?: string;
  sector_id?: string;
  type_id?: string;
  status?: 'active' | 'inactive' | 'archived' | 'all';
  page?: number;
  page_size?: number;
}

// School sort parameters
export interface SchoolSortParams {
  field: string;
  direction: 'asc' | 'desc';
}

// Create DTO
export interface CreateSchoolDto {
  name: string;
  code?: string;
  type_id?: string;
  region_id?: string;
  sector_id: string;
  address?: string;
  email?: string;
  phone?: string;
  director?: string;
  student_count?: number;
  teacher_count?: number;
  status?: string;
}

// Update DTO
export interface UpdateSchoolDto {
  name?: string;
  code?: string;
  type_id?: string;
  region_id?: string;
  sector_id?: string;
  address?: string;
  email?: string;
  phone?: string;
  director?: string;
  student_count?: number;
  teacher_count?: number;
  status?: string;
  archived?: boolean;
}
