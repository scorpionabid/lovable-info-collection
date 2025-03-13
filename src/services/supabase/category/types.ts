
import { Json } from '@/integrations/supabase/types';

export type CategoryAssignment = 'All' | 'Regions' | 'Sectors' | 'Schools' | string;
export type CategoryStatus = 'Active' | 'Inactive' | string;

export interface CategoryFilter {
  searchQuery?: string;
  status?: string;
  assignment?: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  search?: string;
  deadlineBefore?: string;
  deadlineAfter?: string;
  minCompletionRate?: number;
  maxCompletionRate?: number;
}

export interface PaginationOptions {
  page: number;
  pageSize: number;
}

export interface SortOptions {
  column: string;
  direction: 'asc' | 'desc';
}

export interface Category {
  id: string;
  name: string;
  description: string;
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
  columns?: number | CategoryColumn[];
  completionRate: number;
  createdAt: string;
  deadline: string;
}

export interface CategoryColumn {
  id: string;
  name: string;
  type: string;
  required: boolean;
  description: string;
  options?: string[] | any;
  order: number;
  category_id?: string;
  created_at?: string;
  updated_at?: string;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
    pattern?: string;
    options?: string[];
  };
}

export interface CreateCategoryDto {
  name: string;
  description: string;
  assignment: CategoryAssignment;
  priority: number;
  status: CategoryStatus;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

export interface CreateColumnDto {
  name: string;
  type: string;
  required: boolean;
  description: string;
  options?: string[] | any;
  category_id?: string;
  order?: number;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
    pattern?: string;
    options?: string[];
  };
}

export interface UpdateColumnDto extends Partial<CreateColumnDto> {}

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

// Extended type for use in frontend components
export interface ExtendedColumnData extends CategoryColumn {
  type: string;
  required: boolean;
  options?: string[] | any;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
    pattern?: string;
    options?: string[];
  };
}
