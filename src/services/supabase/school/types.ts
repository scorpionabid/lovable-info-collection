
/**
 * School related types
 */

export interface SchoolFilter {
  searchQuery?: string;
  region_id?: string; // snake_case
  sector_id?: string; // snake_case  
  regionId?: string;  // camelCase
  sectorId?: string;  // camelCase
  type?: string;      // For type filter
  status?: 'active' | 'inactive' | 'all';
  minCompletionRate?: number;
  maxCompletionRate?: number;
  page?: number;
  pageSize?: number;
}

export interface School {
  id: string;
  name: string;
  code: string;
  type_id: string;
  region_id: string;
  sector_id: string;
  address?: string;
  director?: string;
  email?: string;
  phone?: string;
  student_count?: number;
  teacher_count?: number;
  created_at: string;
  updated_at: string;
  status?: string;
  // UI specific properties
  type?: string;
  region?: string;
  sector?: string;
  studentCount?: number; // camelCase alias for student_count
  teacherCount?: number; // camelCase alias for teacher_count
  completionRate?: number;
  adminName?: string;
  adminId?: string;
  contactEmail?: string; // alias for email
  contactPhone?: string; // alias for phone
}

export interface CreateSchoolDto {
  name: string;
  code?: string;
  type_id?: string;
  region_id: string;
  sector_id: string;
  address?: string;
  director?: string;
  email?: string;
  phone?: string;
  student_count?: number;
  teacher_count?: number;
  status?: string;
  // Camel case versions
  studentCount?: number;
  teacherCount?: number;
  contactEmail?: string;
}

export interface UpdateSchoolDto extends Partial<CreateSchoolDto> {
  id: string;
}

export interface SchoolStats {
  total_students: number;
  total_teachers: number;
  student_teacher_ratio: number;
  completion_percentage: number;
  last_updated: string;
  categories: Array<{ name: string; value: number }>;
  completionHistory: Array<{ name: string; value: number }>;
}

export interface SchoolTableProps {
  schools: School[];
  isLoading: boolean;
  isError?: boolean;
  onEditSchool: (school: School) => void;
  onDeleteSchool: (schoolId: string) => void;
}
