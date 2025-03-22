
import { Tables } from "./shared";

// Base Sector type
export type Sector = Tables<'sectors'> & {
  code?: string;
  description?: string;
  region?: string;
  archived?: boolean;
  regionName?: string;
  schools_count?: number;
  completion_rate?: number;
  schoolCount?: number;
  completionRate?: number;
};

// Filter parameters for sector queries
export interface SectorFilters {
  search?: string;
  region_id?: string;
  status?: 'active' | 'inactive' | 'all' | 'archived';
  page?: number;
  page_size?: number;
}

// Sector with statistics for dashboard display
export interface SectorWithStats extends Sector {
  schoolCount: number;
  completionRate: number;
  regionName?: string;
  // Support older property names for backward compatibility
  schools_count?: number;
  completion_rate?: number;
}

// Create DTO
export interface CreateSectorDto {
  name: string;
  code?: string;
  description?: string;
  region_id: string;
}

// Update DTO
export interface UpdateSectorDto {
  name?: string;
  code?: string;
  description?: string;
  region_id?: string;
}
