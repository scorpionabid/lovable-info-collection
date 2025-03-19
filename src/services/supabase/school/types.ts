
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
