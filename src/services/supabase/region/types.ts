
// RegionWithStats type definition
import { Tables } from '@/integrations/supabase/types';

// Base Region type
export type Region = Tables<'regions'>;

// Extended Region type with calculated stats
export interface RegionWithStats extends Region {
  sectorCount: number;
  schoolCount: number;
  studentCount: number;
  teacherCount: number;
  completionRate: number;
  // If you need more stats, add them here
}

// Filter for regions
export interface RegionFilter {
  search?: string;
  min_completion_rate?: number;
  max_completion_rate?: number;
  page?: number;
  page_size?: number;
}

// Create DTO
export interface CreateRegionDto {
  name: string;
  code?: string;
}

// Update DTO
export interface UpdateRegionDto {
  name?: string;
  code?: string;
}
