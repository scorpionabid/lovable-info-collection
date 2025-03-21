
import { Tables } from '@/integrations/supabase/types';

// Base School type 
export type School = Tables<'schools'> & {
  archived: boolean;
  region?: string;
  sector?: string;
  type?: string;
  studentCount?: number;
  teacherCount?: number;
  completionRate?: number;
  contactEmail?: string;
  contactPhone?: string;
  createdAt?: string;
};

export interface SchoolType {
  id: string;
  name: string;
  description?: string;
}

// Filter for schools
export interface SchoolFilter {
  search?: string;
  region_id?: string;
  sector_id?: string;
  type_id?: string;
  status?: 'active' | 'inactive' | 'all';
  min_completion_rate?: number;
  max_completion_rate?: number;
  page?: number;
  page_size?: number;
  // For backward compatibility 
  regionId?: string;
  sectorId?: string;
  type?: string;
  sort?: SchoolSortParams;
  sort_field?: string;
  sort_direction?: 'asc' | 'desc';
}

export interface SchoolSortParams {
  field: string;
  direction: 'asc' | 'desc';
}

// Create DTO
export interface CreateSchoolDto {
  name: string;
  sector_id: string;
  region_id?: string;
  type_id?: string;
  code?: string;
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
  sector_id?: string;
  region_id?: string;
  type_id?: string;
  code?: string;
  address?: string;
  email?: string;
  phone?: string;
  director?: string;
  student_count?: number;
  teacher_count?: number;
  status?: string;
}
