
import { Tables } from '@/integrations/supabase/types';

// Base School type
export type School = Tables<'schools'> & {
  // Required fields
  archived?: boolean;
  director?: string;
  email?: string;
  phone?: string;
  status?: string;
  student_count?: number;
  teacher_count?: number;
  // Virtual properties for joins and UI
  type?: string;
  region?: string;
  sector?: string;
  completionRate?: number;
  contactEmail?: string;
  contactPhone?: string;
  adminName?: string;
  adminId?: string;
  code?: string;
  // Backward compatibility fields
  studentCount?: number;
  teacherCount?: number;
  type_id?: string;
};

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
  // Add fields for pagination and sorting
  page?: number;
  pageSize?: number;
  sort?: SchoolSortParams;
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

export interface SchoolWithStats extends Partial<School> {
  id: string;
  name: string;
  code?: string;
  type_id?: string;
  region_id?: string;
  sector_id?: string;
  address?: string;
  created_at: string;
  updated_at?: string;
  status?: string;
  director?: string;
  email?: string;
  phone?: string;
  student_count?: number;
  teacher_count?: number;
  archived?: boolean;
  
  // Virtual properties derived from joined tables or calculations
  type?: string;
  region?: string;
  sector?: string;
  completionRate?: number;
  contactEmail?: string;
  contactPhone?: string;
  adminName?: string;
  adminId?: string;
  
  // For backward compatibility
  studentCount?: number;
  teacherCount?: number;
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
  archived?: boolean;
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
  status?: string;
  student_count?: number;
  teacher_count?: number;
  director?: string;
  email?: string;
  phone?: string;
  archived?: boolean;
}

export interface SchoolStats {
  totalStudents: number;
  totalTeachers: number;
  completionRate: number;
  lastUpdate: string;
}

export interface SchoolTableProps {
  schools: School[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  onSortChange: (column: string) => void;
  isLoading: boolean;
  isError: boolean;
  onRefresh: () => void;
  onEditSchool?: (school: School) => void;
  onDeleteSchool?: (school: SchoolWithStats) => void;
}
