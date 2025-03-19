// School types
export interface School {
  id: string;
  name: string;
  code: string;
  region_id: string;
  sector_id: string;
  type_id: string;
  address: string;
  created_at: string;
  updated_at: string;
  student_count?: number;
  teacher_count?: number;
  status?: string;
  director?: string;
  email?: string;
  phone?: string;
  // Additional properties for UI components
  type?: string;
  region?: string;
  sector?: string;
  studentCount?: number;
  teacherCount?: number;
  completionRate?: number;
  contactEmail?: string;
  contactPhone?: string;
  createdAt?: string;
  adminName?: string;
  adminId?: string;
}

export interface CreateSchoolDto {
  name: string;
  code: string;
  region_id: string;
  sector_id: string;
  type_id: string;
  address: string;
  student_count?: number;
  teacher_count?: number;
  status?: string;
  director?: string;
  email?: string;
  phone?: string;
  // Additional properties for form handling
  contactEmail?: string;
  contactPhone?: string;
  studentCount?: number;
  teacherCount?: number;
}

export interface UpdateSchoolDto {
  name?: string;
  code?: string;
  region_id?: string;
  sector_id?: string;
  type_id?: string;
  address?: string;
  student_count?: number;
  teacher_count?: number;
  status?: string;
  director?: string;
  email?: string;
  phone?: string;
}

export interface SchoolFilter {
  region_id?: string;
  sector_id?: string;
  type_id?: string;
  search?: string;
  status?: string;
  // Additional properties used in UI components
  regionId?: string;
  sectorId?: string;
  type?: string;
  minCompletionRate?: number;
  maxCompletionRate?: number;
}

export interface SchoolSummary {
  id: string;
  name: string;
  code: string;
  region: string;
  sector: string;
  status: string;
  students: number;
  teachers: number;
}

export interface SchoolStats {
  total_students: number;
  total_teachers: number;
  student_teacher_ratio: number;
  completion_percentage: number;
  last_updated: string;
  // Additional properties for charts
  categories?: any[];
  completionHistory?: any[];
}

export interface SchoolWithAdmin extends School {
  admin?: {
    id: string;
    name: string;
    email: string;
  };
}

export type SchoolDatabaseRow = {
  id: string;
  name: string;
  code: string;
  region_id: string;
  sector_id: string;
  type_id: string;
  address: string;
  created_at: string;
  updated_at: string;
  student_count?: number;
  teacher_count?: number;
  status?: string;
  director?: string;
  email?: string;
  phone?: string;
  school_types?: any;
  regions?: any;
  sectors?: any;
};
