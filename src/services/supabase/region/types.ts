
import { Region } from '../supabaseClient';

// Extended Region type to include statistics
export interface RegionWithStats extends Region {
  sectorCount: number;
  schoolCount: number;
  completionRate: number;
  userCount?: number;
}

// Pagination parameters
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// Sort parameters
export interface SortParams {
  column: string;
  direction: 'asc' | 'desc';
}

// Filter parameters
export interface FilterParams {
  searchQuery?: string;
  dateFrom?: string;
  dateTo?: string;
  completionRate?: 'all' | 'high' | 'medium' | 'low';
}
