
export interface Region {
  id: string;
  name: string;
  code?: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}

export interface RegionWithStats extends Region {
  sectorCount?: number;
  schoolCount?: number;
  studentCount?: number;
  teacherCount?: number;
  completionRate?: number;
  // For backward compatibility
  sectors_count?: number;
  schools_count?: number;
  completion_rate?: number;
}

export interface RegionFilters {
  search?: string;
  status?: 'active' | 'inactive' | 'all';
  dateFrom?: string;
  dateTo?: string;
  min_completion_rate?: number;
  max_completion_rate?: number;
}

export interface CreateRegionDto {
  name: string;
  code?: string;
  description?: string;
}

export interface UpdateRegionDto {
  name?: string;
  code?: string;
  description?: string;
}
