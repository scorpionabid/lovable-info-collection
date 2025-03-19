
// Define our school types
export interface School {
  id: string;
  name: string;
  type?: string;
  type_id?: string;
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
  // Database field names
  email?: string;
  phone?: string;
  student_count?: number;
  teacher_count?: number;
  code?: string;
  created_at?: string;
  updated_at?: string;
  archived?: boolean;
}

export interface SchoolDatabaseRow {
  id: string;
  name: string;
  region_id?: string;
  sector_id: string;
  type_id?: string;
  address?: string;
  email?: string;
  phone?: string;
  director?: string;
  student_count?: number;
  teacher_count?: number;
  status?: string;
  code?: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateSchoolDto {
  name: string;
  region_id: string;
  sector_id: string;
  type?: string;
  type_id?: string;
  address?: string;
  studentCount?: number;
  teacherCount?: number;
  contactEmail?: string;
  contactPhone?: string;
  director?: string;
  status?: string;
  // Database field names
  email?: string;
  phone?: string;
  student_count?: number;
  teacher_count?: number;
  code?: string;
}

export interface UpdateSchoolDto {
  name?: string;
  region_id?: string;
  sector_id?: string;
  type?: string;
  type_id?: string;
  address?: string;
  studentCount?: number;
  teacherCount?: number;
  contactEmail?: string;
  contactPhone?: string;
  director?: string;
  status?: string;
  // Database field names
  email?: string;
  phone?: string;
  student_count?: number;
  teacher_count?: number;
  code?: string;
  archived?: boolean;
}

export interface SchoolFilter {
  search?: string;
  regionId?: string;
  sectorId?: string;
  type?: string;
  status?: string;
  // Min/Max completion rate for filtering
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
  completionHistory?: any[]; // Add this to fix the type error
}
