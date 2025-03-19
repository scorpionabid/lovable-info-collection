
// RegionWithStats type definition
import { Tables } from '@/integrations/supabase/types';

// Base Region type
export type Region = Tables<'regions'>;

// Define additional types needed for regions
export interface FilterParams {
  searchQuery?: string;
  name?: string;
  code?: string;
  status?: 'active' | 'archived' | 'all';
  dateFrom?: string;
  dateTo?: string;
  completionRate?: string | 'all';
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

// Sector type for backward compatibility
export interface Sector {
  id: string;
  name: string;
  region_id: string;
  description: string;
  created_at: string;
  archived: boolean;
}

// SectorData type for data submission
export interface SectorData {
  name: string;
  region_id: string;
  description?: string;
}

// Extended Region type with calculated stats
export interface RegionWithStats extends Region {
  // Required fields
  sectorCount: number;
  schoolCount: number;
  studentCount: number;
  teacherCount: number;
  completionRate: number;
  description: string; // Required according to error messages

  // Optional fields for UI elements
  userCount?: number;

  // Backward compatibility fields (to support both naming conventions)
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
