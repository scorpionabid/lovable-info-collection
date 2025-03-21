
import { supabase } from '../client';
import { Tables } from '@/integrations/supabase/types';

export type Category = Tables<'categories'>;

export interface CreateCategoryDto {
  name: string;
  description?: string;
  type?: string;
  region_id?: string | null;
  sector_id?: string | null;
  school_id?: string | null;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  type?: string;
  region_id?: string | null;
  sector_id?: string | null;
  school_id?: string | null;
}

export interface CategoryColumn {
  id: string;
  category_id: string;
  name: string;
  type: string;
  required: boolean;
  description?: string;
  options?: string[] | any;
  order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateColumnDto {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
  options?: string[] | any;
  order?: number;
}

export interface UpdateColumnDto {
  name?: string;
  type?: string;
  required?: boolean;
  description?: string;
  options?: string[] | any;
  order?: number;
}

/**
 * Get all categories
 */
export const getCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Get a category by ID
 */
export const getCategoryById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching category with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new category
 */
export const createCategory = async (categoryData: CreateCategoryDto) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert(categoryData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

/**
 * Update a category
 */
export const updateCategory = async (id: string, categoryData: UpdateCategoryDto) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating category with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a category
 */
export const deleteCategory = async (id: string) => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error deleting category with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Get columns for a category
 */
export const getCategoryColumns = async (categoryId: string): Promise<CategoryColumn[]> => {
  try {
    const { data, error } = await supabase
      .from('columns')
      .select('*')
      .eq('category_id', categoryId)
      .order('order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching columns for category ${categoryId}:`, error);
    throw error;
  }
};

/**
 * Create a column for a category
 */
export const createColumn = async (categoryId: string, columnData: CreateColumnDto) => {
  try {
    const { data, error } = await supabase
      .from('columns')
      .insert({
        ...columnData,
        category_id: categoryId
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error creating column for category ${categoryId}:`, error);
    throw error;
  }
};

/**
 * Update a column
 */
export const updateColumn = async (id: string, columnData: UpdateColumnDto) => {
  try {
    const { data, error } = await supabase
      .from('columns')
      .update(columnData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating column with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a column
 */
export const deleteColumn = async (id: string) => {
  try {
    const { error } = await supabase
      .from('columns')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error deleting column with ID ${id}:`, error);
    throw error;
  }
};
