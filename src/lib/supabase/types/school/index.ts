
import { Tables } from '../shared';

export interface School {
  id: string;
  name: string;
  code: string;
  region_id: string;
  sector_id: string;
  type_id: string;
  address: string;
  director?: string;
  email?: string;
  phone?: string;
  status?: string;
  student_count?: number;
  teacher_count?: number;
  created_at: string;
  updated_at: string;
  archived: boolean;
  
  // Optional fields that might be populated from relationships
  regions?: any;
  sectors?: any;
  school_types?: any;
  
  // Convenience fields for frontend display
  completionRate?: number;
  adminName?: string;
  adminId?: string;
  
  // Computed fields for display
  type?: string;
  region?: string;
  sector?: string;
}

export interface SchoolType {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SchoolFilter {
  search?: string;
  region_id?: string;
  regionId?: string;
  sector_id?: string;
  sectorId?: string;
  type_id?: string;
  type?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  sort?: SchoolSortParams;
  sort_field?: string;
  sort_direction?: 'asc' | 'desc';
  field?: string;
  direction?: 'asc' | 'desc';
  min_student_count?: string | number;
  max_student_count?: string | number;
}

export interface SchoolSortParams {
  field: string;
  direction: 'asc' | 'desc';
}

export interface CreateSchoolDto {
  name: string;
  code: string;
  region_id: string;
  sector_id: string;
  type_id: string;
  address: string;
  director?: string;
  email?: string;
  phone?: string;
  status?: string;
  student_count?: number;
  teacher_count?: number;
  archived?: boolean;
}

export interface UpdateSchoolDto extends Partial<CreateSchoolDto> {}
