
import { Tables } from "./shared";

// Base School type from the database
export type School = Tables<'schools'> & {
  archived?: boolean; // Make archived optional to accommodate both versions
  code?: string;
  description?: string;
  completionRate?: number;
  type?: string;
  region?: string;
  sector?: string;
  
  // Adding the missing properties from the error messages
  director?: string;
  email?: string;
  phone?: string;
  student_count?: number;
  teacher_count?: number;
  status?: string;
};

// SchoolType definition
export interface SchoolType {
  id: string;
  name: string;
  description?: string;
}

// Filter parameters for school queries
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
  // Modified to make both formats compatible
  sort?: SchoolSortParams;
  sort_field?: string;
  sort_direction?: 'asc' | 'desc';
  field?: string;
  direction?: 'asc' | 'desc';
  min_student_count?: string | number;
  max_student_count?: string | number;
}

// Sort parameters for school queries
export interface SchoolSortParams {
  field: string;
  direction: 'asc' | 'desc';
}

// Data transfer object for creating a new school
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
  contactEmail?: string;
  contactPhone?: string;
  studentCount?: number;
  teacherCount?: number;
}

// Data transfer object for updating a school
export interface UpdateSchoolDto {
  name?: string;
  code?: string;
  region_id?: string;
  sector_id?: string;
  type_id?: string;
  address?: string;
  director?: string;
  email?: string;
  phone?: string;
  status?: string;
  student_count?: number;
  teacher_count?: number;
  archived?: boolean;
}

// School with statistics
export interface SchoolWithStats extends School {
  completionRate: number;
  adminName?: string;
  adminId?: string;
}
