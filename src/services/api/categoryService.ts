
import * as categoryService from '@/services/supabase/category';

// Re-export types with correct type syntax
export type { CategoryFilter, Category, CreateCategoryDto, UpdateCategoryDto, CategoryColumn } from '@/services/supabase/category/types';

// Re-export all functions
export const getCategories = categoryService.getCategories;
export const getCategoryById = categoryService.getCategoryById;
export const createCategory = categoryService.createCategory;
export const updateCategory = categoryService.updateCategory;
export const deleteCategory = categoryService.deleteCategory;
export const updateCategoryPriority = categoryService.updateCategoryPriority;
export const getCategoryColumns = categoryService.getCategoryColumns;
export const getCategoryColumnsCount = categoryService.getCategoryColumnsCount;
export const createColumn = categoryService.createColumn;
export const updateColumn = categoryService.updateColumn;
export const deleteColumn = categoryService.deleteColumn;
export const updateColumnsOrder = categoryService.updateColumnsOrder;
export const calculateCategoryCompletionRate = categoryService.calculateCategoryCompletionRate;
export const getRegionCompletionData = categoryService.getRegionCompletionData;
export const exportCategoryTemplate = categoryService.exportCategoryTemplate;
