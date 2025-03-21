
import { Tables } from '@/integrations/supabase/types';

// Base Region type from the database
export type Region = Tables<'regions'>;

// Filter parameters for region queries
export interface RegionFilters {
  search?: string;
  status?: 'active' | 'inactive' | 'all';
  min_completion_rate?: number;
  max_completion_rate?: number;
  page?: number;
  page_size?: number;
}

// Region with statistics for dashboard display
export interface RegionWithStats extends Region {
  sectorCount: number;
  schoolCount: number;
  studentCount: number; // Added this property
  teacherCount: number; // Added this property
  userCount?: number;   // Added this property
  completionRate: number;
  status?: string;      // Added this property
  // Support older property names for backward compatibility
  sectors_count?: number;
  schools_count?: number;
  completion_rate?: number;
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
