
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

// Interface for creating a new school
export interface CreateSchoolDto {
  name: string;
  type: string;
  region_id: string;
  sector_id: string;
  region?: string;
  sector?: string;
  studentCount: number;
  teacherCount: number;
  address?: string;
  contactEmail: string;
  contactPhone: string;
  status: string;
}

// Interface for updating an existing school
export interface UpdateSchoolDto extends Partial<CreateSchoolDto> {}
