
// School interface to match the database schema
export interface School {
  id: string;
  name: string;
  code: string;
  region_id: string;
  sector_id: string;
  type_id: string;
  address: string;
  
  // Optional fields that might not exist in all responses
  director?: string;
  email?: string;
  phone?: string;
  status?: string;
  student_count?: number;
  teacher_count?: number;
  archived?: boolean;
  
  // Required fields
  created_at: string;
  updated_at: string;
  
  // Optional fields that might be populated from relationships
  regions?: any;
  sectors?: any;
  school_types?: any;
  activities?: any[];
  
  // Convenience fields for frontend display
  completionRate?: number;
  adminName?: string;
  adminId?: string;
  
  // Computed fields for display
  type?: string;
  region?: string;
  sector?: string;
  
  // Aliases for consistent naming
  contactEmail?: string;
  contactPhone?: string;
  studentCount?: number;
  teacherCount?: number;
  createdAt?: string;
}

// SchoolWithStats extends School with statistics
export interface SchoolWithStats extends School {
  completionRate: number;
}

// Filter parameters for querying schools
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

// Interface for database row representation
export interface SchoolDatabaseRow {
  id: string;
  name: string;
  code: string;
  region_id: string;
  sector_id: string;
  type_id: string;
  address: string;
  director: string;
  email: string;
  phone: string;
  status: string;
  student_count: number;
  teacher_count: number;
  created_at: string;
  updated_at: string;
  archived: boolean;
}

// SchoolStats interface for statistics
export interface SchoolStats {
  total_students: number;
  total_teachers: number;
  completion_rate: number;
  lastUpdate?: string;
}

// School activity interface
export interface SchoolActivity {
  id: string;
  action: string;
  user_id: string;
  performed_at: string;
  details?: string;
  metadata?: any;
}
