
import { Tables } from '@/integrations/supabase/types';

// Base Region type
export type Region = Tables<'regions'>;

// Region with statistics for dashboard display
export interface RegionWithStats extends Region {
  sectorCount: number;
  schoolCount: number;
  completionRate: number;
  // Support older property names for backward compatibility
  sectors_count?: number;
  schools_count?: number;
  completion_rate?: number;
}

// Filter parameters for region queries
export interface RegionFilters {
  search?: string;
  status?: 'active' | 'inactive' | 'all';
  min_completion_rate?: number;
  max_completion_rate?: number;
  page?: number;
  page_size?: number;
}

// Create DTO
export interface CreateRegionDto {
  name: string;
  code?: string; 
  description?: string;
}

// Update DTO
export interface UpdateRegionDto {
  name?: string;
  code?: string;
  description?: string;
}
