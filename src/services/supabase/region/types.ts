
// Region types
export interface Region {
  id: string;
  name: string;
  code?: string;
  description?: string; // Added description field
  created_at?: string;
  updated_at?: string;
}

export interface RegionWithStats extends Region {
  sectors_count: number;
  schools_count: number;
  completion_rate: number;
  userCount?: number; // Add userCount for RegionCharts
  // Backward compatibility for old components
  sectorCount?: number;
  schoolCount?: number;
  completionRate?: number;
}

export interface Sector {
  id: string;
  name: string;
  region_id: string;
  code?: string;
  description?: string; // Added description field
  region?: {
    id: string;
    name: string;
  };
  created_at?: string;
  updated_at?: string;
  schools?: any[];
  schools_count?: number;
  completion_rate?: number;
  // Backward compatibility for old components
  schoolCount?: number;
  completionRate?: number;
  regionName?: string;
}

export interface SectorWithStats extends Sector {
  schools_count: number;
  completion_rate: number;
  regionName: string;
  // Backward compatibility for old components
  schoolCount?: number;
  completionRate?: number;
}

export interface FilterParams {
  searchQuery?: string;
  name?: string; // Added name filter
  code?: string; // Added code filter
  status?: string; // Added status filter
  dateFrom?: string;
  dateTo?: string;
  completionRate?: 'all' | 'high' | 'medium' | 'low';
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
  column?: string; // Add column for backward compatibility
}
