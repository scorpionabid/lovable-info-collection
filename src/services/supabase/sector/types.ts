
// SectorWithStats type definition
import { Tables } from '@/integrations/supabase/types';

// Base Sector type
export type Sector = Tables<'sectors'>;

// Define filter params
export interface FilterParams {
  search?: string;
  region_id?: string;
  status?: 'active' | 'inactive' | 'all';
  min_completion_rate?: number;
  max_completion_rate?: number;
}

export interface SortParams {
  column: string;
  direction: 'asc' | 'desc';
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface SectorData {
  name: string;
  region_id: string;
  description?: string;
  code?: string;
}

// Extended Sector type with calculated stats
export interface SectorWithStats extends Sector {
  schoolCount: number;
  completionRate: number;
  regionName?: string;
  archived?: boolean;
  description: string; // Required according to error messages
  // If you need more stats, add them here
}

// Filter for sectors
export interface SectorFilter {
  search?: string;
  region_id?: string;
  status?: 'active' | 'inactive' | 'all';
  min_completion_rate?: number;
  max_completion_rate?: number;
  page?: number;
  page_size?: number;
}

// Create DTO
export interface CreateSectorDto {
  name: string;
  region_id: string;
  code?: string;
  description?: string;
}

// Update DTO
export interface UpdateSectorDto {
  name?: string;
  region_id?: string;
  code?: string;
  description?: string;
}
