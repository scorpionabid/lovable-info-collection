
export interface Region {
  id: string;
  name: string;
  code?: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}

export interface RegionWithStats extends Region {
  sectorCount: number;
  schoolCount: number;
  studentCount: number;
  teacherCount: number;
  completionRate: number;
  
  // Compatibility properties
  sectors_count?: number;
  schools_count?: number;
}

export interface CreateRegionDto {
  name: string;
  code?: string;
  description?: string;
}

export interface UpdateRegionDto extends Partial<CreateRegionDto> {}
