
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
}

export interface SchoolFilter {
  search?: string;
  regionId?: string;
  sectorId?: string;
  type?: string;
  status?: string;
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
