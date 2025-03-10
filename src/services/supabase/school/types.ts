export interface School {
  id: string;
  name: string;
  type: string;
  region: string;
  region_id: string;
  sector: string;
  sector_id: string;
  studentCount: number;
  teacherCount: number;
  completionRate: number;
  status: string;
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
  address?: string;
  director?: string;
  adminName?: string | null;
  adminId?: string | null;
}

export interface SchoolFilter {
  search?: string;
  regionId?: string;
  sectorId?: string;
  type?: string;
  status?: string;
  minCompletionRate?: number;
  maxCompletionRate?: number;
}

export interface Category {
  name: string;
  value: number;
}

export interface CompletionHistory {
  name: string;
  value: number;
}

export interface SchoolStats {
  categories: Category[];
  completionHistory: CompletionHistory[];
}

export interface CreateSchoolDto {
  name: string;
  type: string; // This needs to be a valid UUID for type_id
  region_id: string; // This must be a valid UUID
  sector_id: string; // This must be a valid UUID
  region?: string;
  sector?: string;
  studentCount: number;
  teacherCount: number;
  address?: string;
  contactEmail: string;
  contactPhone: string;
  status: string;
  director?: string;
}

export interface UpdateSchoolDto extends Partial<CreateSchoolDto> {}
