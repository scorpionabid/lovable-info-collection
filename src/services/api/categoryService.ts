
import * as categoryService from '@/services/supabase/category';
import { CategoryType, CategoryColumn, ColumnData } from '@/components/categories/types';

// Export CategoryColumn and ColumnData types for use in other files
export { CategoryType, CategoryColumn, ColumnData };

// Define types for API functions
export interface CategoryResponse {
  data: CategoryType[];
  count: number;
  error?: any;
}

export interface SingleCategoryResponse {
  data: CategoryType;
  error?: any;
}

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

export interface CategoryService {
  getCategories: (filters?: CategoryFilter) => Promise<CategoryType[]>;
  getCategoryById: (id: string) => Promise<CategoryType>;
  createCategory: (category: any) => Promise<CategoryType>;
  updateCategory: (id: string, category: any) => Promise<CategoryType>;
  deleteCategory: (id: string) => Promise<void>;
  getCategoryColumns: (categoryId: string) => Promise<CategoryColumn[]>;
  createColumn: (categoryId: string, column: any) => Promise<CategoryColumn>;
  updateColumn: (id: string, column: any) => Promise<CategoryColumn>;
  deleteColumn: (id: string) => Promise<void>;
  updateCategoryPriority: (id: string, newPriority: number) => Promise<void>;
  getRegionCompletionData: (categoryId: string) => Promise<{ name: string; completion: number }[]>;
  exportCategoryTemplate: (categoryId: string) => Promise<Blob>;
}

// Implement service by forwarding to Supabase implementation with type casting
const service: CategoryService = {
  getCategories: async (filters?: CategoryFilter) => {
    const categories = await categoryService.getCategories(filters);
    return categories as unknown as CategoryType[];
  },
  getCategoryById: async (id: string) => {
    const category = await categoryService.getCategoryById(id);
    return category as unknown as CategoryType;
  },
  createCategory: async (category: any) => {
    const newCategory = await categoryService.createCategory(category);
    return newCategory as unknown as CategoryType;
  },
  updateCategory: async (id: string, category: any) => {
    const updatedCategory = await categoryService.updateCategory(id, category);
    return updatedCategory as unknown as CategoryType;
  },
  deleteCategory: categoryService.deleteCategory,
  getCategoryColumns: async (categoryId: string) => {
    const columns = await categoryService.getCategoryColumns(categoryId);
    return columns as unknown as CategoryColumn[];
  },
  createColumn: async (categoryId: string, column: any) => {
    const newColumn = await categoryService.createColumn(categoryId, column);
    return newColumn as unknown as CategoryColumn;
  },
  updateColumn: async (id: string, column: any) => {
    const updatedColumn = await categoryService.updateColumn(id, column);
    return updatedColumn as unknown as CategoryColumn;
  },
  deleteColumn: categoryService.deleteColumn,
  updateCategoryPriority: categoryService.updateCategoryPriority,
  getRegionCompletionData: categoryService.getRegionCompletionData,
  exportCategoryTemplate: categoryService.exportCategoryTemplate,
};

export default service;
