
import { Tables } from '@/integrations/supabase/types';

// Base School type
export type School = Tables<'schools'>;

// Database row type
export interface SchoolDatabaseRow {
  id: string;
  name: string;
  code?: string;
  region_id?: string;
  sector_id: string;
  type_id?: string;
  address?: string;
  created_at: string;
  updated_at?: string;
  student_count?: number;
  teacher_count?: number;
  status?: string;
  director?: string;
  email?: string;
  phone?: string;
  archived?: boolean;
}

export interface SchoolFilter {
  search?: string;
  region_id?: string;
  sector_id?: string;
  type_id?: string;
  status?: 'all' | 'active' | 'inactive';
  min_student_count?: number | string;
  max_student_count?: number | string;
  // Backwards compatibility
  regionId?: string;
  sectorId?: string;
  type?: string;
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
  contactEmail?: string;
  contactPhone?: string;
  adminName?: string;
  // For backward compatibility
  studentCount?: number;
  teacherCount?: number;
  type_id?: string;
  archived?: boolean;
}

export interface CreateSchoolDto {
  name: string;
  sector_id: string;
  region_id?: string;
  type_id?: string;
  code?: string;
  address?: string;
  student_count?: number;
  teacher_count?: number;
  status?: string;
  director?: string;
  email?: string;
  phone?: string;
  contactEmail?: string;
  contactPhone?: string;
  // For backward compatibility
  studentCount?: number;
  teacherCount?: number;
}

export interface UpdateSchoolDto {
  name?: string;
  sector_id?: string;
  region_id?: string;
  type_id?: string;
  code?: string;
  address?: string;
  status?: 'active' | 'inactive';
  student_count?: number;
  teacher_count?: number;
  director?: string;
  email?: string;
  phone?: string;
}

export interface SchoolStats {
  totalStudents: number;
  totalTeachers: number;
  completionRate: number;
  lastUpdate: string;
}
