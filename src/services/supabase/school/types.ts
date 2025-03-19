
// Define our school types
export interface School {
  id: string;
  name: string;
  type?: string;
  region?: string;
  region_id?: string;
  sector?: string;
  sector_id: string;
  studentCount?: number;
  teacherCount?: number;
  completionRate?: number;
  status?: string;
  director?: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt?: string;
  address?: string;
  adminName?: string | null;
  adminId?: string | null;
  // Add properties to match database schema
  email?: string;
  phone?: string;
  student_count?: number;
  teacher_count?: number;
}

export interface CreateSchoolDto {
  name: string;
  region_id: string;
  sector_id: string;
  type?: string;
  address?: string;
  studentCount?: number;
  teacherCount?: number;
  contactEmail?: string;
  contactPhone?: string;
  director?: string;
  status?: string;
  // Add missing properties
  email?: string;
  phone?: string;
  student_count?: number;
  teacher_count?: number;
}

export interface UpdateSchoolDto {
  name?: string;
  region_id?: string;
  sector_id?: string;
  type?: string;
  address?: string;
  studentCount?: number;
  teacherCount?: number;
  contactEmail?: string;
  contactPhone?: string;
  director?: string;
  status?: string;
  // Add missing properties
  email?: string;
  phone?: string;
  student_count?: number;
  teacher_count?: number;
}

export interface SchoolFilter {
  search?: string;
  regionId?: string;
  sectorId?: string;
  type?: string;
  status?: string;
  // Add missing properties
  minCompletionRate?: number;
  maxCompletionRate?: number;
}

export interface SchoolSummary {
  id: string;
  name: string;
  studentCount: number;
  teacherCount: number;
  completionRate: number;
  status: string;
}

export interface SchoolWithAdmin extends School {
  admin?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  } | null;
}

// Add SchoolStats interface
export interface SchoolStats {
  totalSchools: number;
  activeSchools: number;
  averageCompletionRate: number;
}
