
import { Database } from '@/types/supabase';

export type Region = Database['public']['Tables']['regions']['Row'];

export interface RegionWithStats extends Region {
  sectorCount: number;
  schoolCount: number;
  completionRate: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface SortParams {
  column: string;
  direction: 'asc' | 'desc';
}

export interface FilterParams {
  searchQuery?: string;
  dateFrom?: string;
  dateTo?: string;
  completionRate?: string;
}

export interface RegionFilter {
  searchTerm?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
  completionRate?: string;
}
