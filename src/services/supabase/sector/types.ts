
import { Tables } from '@/integrations/supabase/types';

export interface SectorData {
  id?: string;
  name: string;
  description?: string;
  region_id: string;
  created_at?: string;
  updated_at?: string;
  archived?: boolean;
}

export interface SectorWithStats extends SectorData {
  regions?: {
    id: string;
    name: string;
  };
  regionName: string;
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
  [key: string]: string | number | boolean | undefined;
  searchQuery?: string;
  regionId?: string;
  dateFrom?: string;
  dateTo?: string;
  completionRate?: string;
  archived?: string;
}
