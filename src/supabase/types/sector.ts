
import { Tables } from '@/integrations/supabase/types';

// Base Sector type
export type Sector = Tables<'sectors'>;

// Sector with statistics for dashboard display
export interface SectorWithStats extends Sector {
  schoolCount: number;
  completionRate: number;
  // Support older property names for backward compatibility
  schools_count?: number;
  completion_rate?: number;
}

// Filter parameters for sector queries
export interface SectorFilters {
  search?: string;
  region_id?: string;
  status?: 'active' | 'inactive' | 'all';
  page?: number;
  page_size?: number;
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
