
import { CategoryColumn } from '@/components/categories/CategoryDetailView';

// Interfaces for the service
export interface Category {
  id: string;
  name: string;
  description: string;
  assignment: 'All' | 'Regions' | 'Sectors' | 'Schools';
  columns: number | CategoryColumn[];
  completionRate: number;
  status: 'Active' | 'Inactive';
  priority: number;
  createdAt: string;
}

export interface CategoryFilter {
  search?: string;
  assignment?: 'All' | 'Regions' | 'Sectors' | 'Schools';
  status?: 'Active' | 'Inactive';
  deadlineBefore?: string;
  deadlineAfter?: string;
  minCompletionRate?: number;
  maxCompletionRate?: number;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  assignment: 'All' | 'Regions' | 'Sectors' | 'Schools';
  priority: number;
  status: 'Active' | 'Inactive';
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

export interface CreateColumnDto {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  options?: string[];
}

export interface UpdateColumnDto extends Partial<CreateColumnDto> {
  order?: number;
}
