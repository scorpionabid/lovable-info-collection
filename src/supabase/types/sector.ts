
import { Tables } from '@/integrations/supabase/types';

// Base Sector type
export type Sector = Tables<'sectors'>;

// Filter parameters for sector queries
export interface SectorFilters {
  search?: string;
  region_id?: string;
  status?: 'active' | 'inactive' | 'all';
  page?: number;
  page_size?: number;
}

// Sector with statistics for dashboard display
export interface SectorWithStats extends Sector {
  schoolCount: number;
  completionRate: number;
  code?: string; // Explicitly included
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
