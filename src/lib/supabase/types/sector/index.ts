
export interface Sector {
  id: string;
  name: string;
  region_id: string;
  code?: string;
  description?: string;
  created_at: string;
  updated_at?: string;
  archived?: boolean;
}

export interface SectorWithStats extends Sector {
  schoolCount?: number;
  completionRate?: number;
  // For backward compatibility
  schools_count?: number;
  completion_rate?: number;
  school_count?: number;
  region?: string;
}

export interface SectorFilters {
  search?: string;
  region_id?: string;
  status?: 'active' | 'inactive' | 'all';
  dateFrom?: string;
  dateTo?: string;
  min_completion_rate?: number;
  max_completion_rate?: number;
}

export interface CreateSectorDto {
  name: string;
  region_id: string;
  code?: string;
  description?: string;
}

export interface UpdateSectorDto {
  name?: string;
  region_id?: string;
  code?: string;
  description?: string;
}
