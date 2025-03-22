
import { Tables } from "./shared";

// Base Region type from the database
export type Region = Tables<'regions'> & {
  code: string;
  description?: string;
};

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
  studentCount?: number; 
  teacherCount?: number; 
  userCount?: number;   
  completionRate: number;
  status?: string;
  archived?: boolean;
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
