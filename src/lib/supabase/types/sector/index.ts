
export interface Sector {
  id: string;
  name: string;
  region_id: string;
  description?: string;
  created_at: string;
  updated_at?: string;
  archived?: boolean;
  regions?: {
    id: string;
    name: string;
  };
}

export interface SectorWithStats extends Sector {
  schoolCount: number;
  completionRate: number;
  schools_count?: number;
  completion_rate?: number;
}

export interface SectorFilters {
  search?: string;
  region_id?: string;
  regionId?: string;
  status?: 'active' | 'archived' | 'all';
  archived?: boolean;
}

export interface CreateSectorDto {
  name: string;
  region_id: string;
  description?: string;
}

export interface UpdateSectorDto extends Partial<CreateSectorDto> {
  archived?: boolean;
}
