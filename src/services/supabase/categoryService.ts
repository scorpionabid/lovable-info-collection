import { supabase } from './supabaseClient';
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

// Category CRUD functions
export const getCategories = async (filters?: CategoryFilter): Promise<Category[]> => {
  try {
    let query = supabase
      .from('categories')
      .select(`
        id,
        name,
        description,
        assignment,
        status,
        priority,
        created_at
      `);

    // Apply filters if provided
    if (filters) {
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      if (filters.assignment) {
        query = query.eq('assignment', filters.assignment);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
    }

    // Always order by priority
    query = query.order('priority', { ascending: true });

    const { data, error } = await query;

    if (error) throw error;

    // If no data is returned, return an empty array
    if (!data || data.length === 0) {
      return [];
    }

    // Calculate completion rates (this would be more complex in a real app)
    const categoriesWithCompletionRates = await Promise.all(
      data.map(async (item) => {
        const completionRate = await calculateCategoryCompletionRate(item.id);
        const columnsCount = await getCategoryColumnsCount(item.id);
        
        return {
          id: item.id,
          name: item.name,
          description: item.description || '',
          assignment: item.assignment || 'All',
          columns: columnsCount,
          completionRate,
          status: item.status,
          priority: item.priority,
          createdAt: item.created_at
        };
      })
    );

    return categoriesWithCompletionRates;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getCategoryById = async (id: string): Promise<Category> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        id,
        name,
        description,
        assignment,
        status,
        priority,
        created_at
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    // Get columns for this category
    const columns = await getCategoryColumns(id);
    const completionRate = await calculateCategoryCompletionRate(id);

    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      assignment: data.assignment,
      columns: columns,
      completionRate,
      status: data.status,
      priority: data.priority,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Error fetching category details:', error);
    throw error;
  }
};

export const createCategory = async (category: CreateCategoryDto): Promise<Category> => {
  try {
    // Validate assignment type
    const validAssignments = ['All', 'Regions', 'Sectors', 'Schools'];
    if (!validAssignments.includes(category.assignment)) {
      throw new Error(`Invalid assignment value. Must be one of: ${validAssignments.join(', ')}`);
    }
    
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: category.name,
        description: category.description,
        assignment: category.assignment,
        priority: category.priority,
        status: category.status
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      assignment: data.assignment,
      columns: 0,
      completionRate: 0,
      status: data.status,
      priority: data.priority,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const updateCategory = async (id: string, category: UpdateCategoryDto): Promise<Category> => {
  try {
    // Validate assignment type if provided
    if (category.assignment) {
      const validAssignments = ['All', 'Regions', 'Sectors', 'Schools'];
      if (!validAssignments.includes(category.assignment)) {
        throw new Error(`Invalid assignment value. Must be one of: ${validAssignments.join(', ')}`);
      }
    }
    
    const { data, error } = await supabase
      .from('categories')
      .update({
        name: category.name,
        description: category.description,
        assignment: category.assignment,
        priority: category.priority,
        status: category.status
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Get columns count and completion rate
    const columnsCount = await getCategoryColumnsCount(id);
    const completionRate = await calculateCategoryCompletionRate(id);

    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      assignment: data.assignment || 'All',
      columns: columnsCount,
      completionRate,
      status: data.status,
      priority: data.priority,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    // First delete all columns associated with this category
    const { error: columnsError } = await supabase
      .from('columns')
      .delete()
      .eq('category_id', id);

    if (columnsError) throw columnsError;

    // Then delete the category
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

export const updateCategoryPriority = async (id: string, newPriority: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('categories')
      .update({ priority: newPriority })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating category priority:', error);
    throw error;
  }
};

// Column CRUD functions
export const getCategoryColumns = async (categoryId: string): Promise<CategoryColumn[]> => {
  try {
    const { data, error } = await supabase
      .from('columns')
      .select('*')
      .eq('category_id', categoryId)
      .order('order', { ascending: true });

    if (error) throw error;

    return data.map(column => ({
      id: column.id,
      name: column.name,
      type: column.type,
      required: column.required,
      description: column.description || '',
      options: column.options,
      order: column.order
    }));
  } catch (error) {
    console.error('Error fetching category columns:', error);
    throw error;
  }
};

export const getCategoryColumnsCount = async (categoryId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('columns')
      .select('id', { count: 'exact', head: true })
      .eq('category_id', categoryId);

    if (error) throw error;

    return count || 0;
  } catch (error) {
    console.error('Error counting category columns:', error);
    return 0;
  }
};

export const createColumn = async (categoryId: string, column: CreateColumnDto): Promise<CategoryColumn> => {
  try {
    // Get the highest order value to set the new column's order
    const { data: existingColumns, error: countError } = await supabase
      .from('columns')
      .select('order')
      .eq('category_id', categoryId)
      .order('order', { ascending: false })
      .limit(1);

    if (countError) throw countError;

    const nextOrder = existingColumns.length > 0 ? existingColumns[0].order + 1 : 1;

    const { data, error } = await supabase
      .from('columns')
      .insert({
        category_id: categoryId,
        name: column.name,
        type: column.type,
        required: column.required,
        description: column.description,
        options: column.options,
        order: nextOrder
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      type: data.type,
      required: data.required,
      description: data.description || '',
      options: data.options,
      order: data.order
    };
  } catch (error) {
    console.error('Error creating column:', error);
    throw error;
  }
};

export const updateColumn = async (id: string, column: UpdateColumnDto): Promise<CategoryColumn> => {
  try {
    const { data, error } = await supabase
      .from('columns')
      .update({
        name: column.name,
        type: column.type,
        required: column.required,
        description: column.description,
        options: column.options,
        order: column.order
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      type: data.type,
      required: data.required,
      description: data.description || '',
      options: data.options,
      order: data.order
    };
  } catch (error) {
    console.error('Error updating column:', error);
    throw error;
  }
};

export const deleteColumn = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('columns')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting column:', error);
    throw error;
  }
};

export const updateColumnsOrder = async (columns: { id: string; order: number }[]): Promise<void> => {
  try {
    // Supabase doesn't support bulk updates, so we need to update each column separately
    for (const column of columns) {
      const { error } = await supabase
        .from('columns')
        .update({ order: column.order })
        .eq('id', column.id);

      if (error) throw error;
    }
  } catch (error) {
    console.error('Error updating columns order:', error);
    throw error;
  }
};

// Helper functions
export const calculateCategoryCompletionRate = async (categoryId: string): Promise<number> => {
  try {
    // This is a placeholder for a more complex calculation involving data entries
    // In a real app, you would calculate this based on how many schools have filled out data for this category
    
    // For now, returning a random number between 20 and 95
    return Math.floor(Math.random() * 75) + 20;
  } catch (error) {
    console.error('Error calculating completion rate:', error);
    return 0;
  }
};

export const getRegionCompletionData = async (categoryId: string): Promise<{ name: string; completion: number }[]> => {
  try {
    // Get all regions
    const { data: regions, error: regionsError } = await supabase
      .from('regions')
      .select('id, name');

    if (regionsError) throw regionsError;

    // Calculate completion rate for each region (this would be a more complex query in a real app)
    const completionData = regions.map(region => ({
      name: region.name,
      completion: Math.floor(Math.random() * 60) + 30 // Random value between 30-90%
    }));

    // Sort by completion rate descending
    return completionData.sort((a, b) => b.completion - a.completion);
  } catch (error) {
    console.error('Error getting region completion data:', error);
    return [];
  }
};

export const exportCategoryTemplate = async (categoryId: string): Promise<Blob> => {
  // This function would generate an Excel template based on category columns
  // For now, we'll just return a simple placeholder
  try {
    console.log(`Exporting template for category ${categoryId}`);
    // Return a simple text blob for demonstration
    return new Blob(['Sample Excel Template'], { type: 'text/plain' });
  } catch (error) {
    console.error('Error exporting category template:', error);
    throw error;
  }
};
