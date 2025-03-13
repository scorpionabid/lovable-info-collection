import { supabase } from '../supabaseClient';
import { Category, CreateCategoryDto, UpdateCategoryDto, CategoryFilter } from './types';
import { calculateCategoryCompletionRate, getCategoryColumnsCount } from './helpers';
import { getCategoryColumns } from './columnQueries';

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
        created_at,
        updated_at
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
      if (filters.deadlineBefore) {
        query = query.lte('created_at', filters.deadlineBefore);
      }
      if (filters.deadlineAfter) {
        query = query.gte('created_at', filters.deadlineAfter);
      }
      if (filters.minCompletionRate !== undefined) {
        query = query.gte('completion_rate', filters.minCompletionRate);
      }
      if (filters.maxCompletionRate !== undefined) {
        query = query.lte('completion_rate', filters.maxCompletionRate);
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
          assignment: item.assignment as Category['assignment'],
          status: item.status as Category['status'],
          priority: item.priority,
          columns: columnsCount,
          completionRate,
          created_at: item.created_at,
          updated_at: item.updated_at || item.created_at,
          createdAt: item.created_at
        } as Category;
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
        created_at,
        updated_at
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
      assignment: data.assignment as Category['assignment'],
      status: data.status as Category['status'],
      priority: data.priority,
      columns: columns,
      completionRate,
      created_at: data.created_at,
      updated_at: data.updated_at || data.created_at,
      createdAt: data.created_at
    } as Category;
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
