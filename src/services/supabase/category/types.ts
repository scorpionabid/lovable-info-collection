
import { Json } from '@/integrations/supabase/types';

export type CategoryAssignment = 'All' | 'Regions' | 'Sectors' | 'Schools' | string;
export type CategoryStatus = 'Active' | 'Inactive' | string;

export interface Category {
  id: string;
  name: string;
  description?: string;
  assignment: CategoryAssignment;
  status: CategoryStatus;
  priority: number;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  school_type_id?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  columns?: number;
  completionRate?: number;
  createdAt?: string;
}

export interface CategoryColumn {
  id: string;
  name: string;
  type: string;
  required: boolean;
  description?: string;
  options: Json | string[];
  order: number;
  category_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryStats {
  totalEntries: number;
  pendingApprovals: number;
  completionRate: number;
  recentActivity: any[];
}

export interface CategoryData {
  id: string;
  category_id: string;
  school_id?: string;
  data: any;
  status: string;
  created_at: string;
  updated_at: string;
  submitted_at?: string;
  approved_at?: string;
  created_by?: string;
  approved_by?: string;
}

export interface CategoryFilter {
  searchQuery?: string;
  status?: string;
  assignment?: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
}

export interface PaginationOptions {
  page: number;
  pageSize: number;
}

export interface SortOptions {
  column: string;
  direction: 'asc' | 'desc';
}
