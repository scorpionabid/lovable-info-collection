
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
  searchQuery?: string;
  dateFrom?: string;
  dateTo?: string;
  archived?: boolean;
  completionRate?: string;
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
export interface SectorWithStats {
  id: string;
  name: string;
  region_id: string;
  description: string;
  created_at: string;
  archived: boolean;
  schoolCount: number;
  completionRate: number;
  regionName?: string;
  code?: string;
  updated_at?: string;
  // Backward compatibility fields
  schools_count?: number;
  completion_rate?: number;
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
