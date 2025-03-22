
import { Tables } from '@/lib/supabase/types/shared';

// Category types
export type CategoryAssignment = 'All' | 'Regions' | 'Sectors' | 'Schools';
export type CategoryStatus = 'active' | 'inactive' | 'draft' | 'archived';

export interface Category {
  id: string;
  name: string;
  description?: string;
  assignment: CategoryAssignment;
  status: CategoryStatus;
  priority: number;
  columns: number;
  completionRate: number;
  createdAt: string;
  created_at: string;
  updated_at?: string;
  deadline?: string;
}

export interface CategoryFilter {
  search?: string;
  assignment?: CategoryAssignment;
  status?: CategoryStatus;
  deadlineBefore?: string;
  deadlineAfter?: string;
  minCompletionRate?: number;
  maxCompletionRate?: number;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  assignment: CategoryAssignment;
  status: CategoryStatus;
  priority: number;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  assignment?: CategoryAssignment;
  status?: CategoryStatus;
  priority?: number;
}

// Column types
export interface CategoryColumn {
  id: string;
  name: string;
  type: string;
  required: boolean;
  description?: string;
  options?: string[] | any;
  order: number;
}

export interface CreateColumnDto {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
  options?: string[] | any;
}

export interface UpdateColumnDto {
  name?: string;
  type?: string;
  required?: boolean;
  description?: string;
  options?: string[] | any;
  order?: number;
}
