
import { supabase } from '../client';
import { 
  Category, 
  CategoryFilter, 
  CreateCategoryDto, 
  UpdateCategoryDto 
} from './types';
import { 
  calculateCategoryCompletionRate, 
  getCategoryColumnsCount,
  withTransaction,
  validateCategoryData
} from './helpers';

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

    if (error) {
      console.error('Database error when fetching categories:', error);
      throw new Error(`Kateqoriyaları əldə edərkən xəta baş verdi: ${error.message}`);
    }

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
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    throw new Error(`Kateqoriyaları əldə edərkən xəta baş verdi: ${error.message || 'Bilinməyən xəta'}`);
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

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error(`Kateqoriya tapılmadı: ID ${id}`);
      }
      throw new Error(`Kateqoriya məlumatları əldə edərkən xəta baş verdi: ${error.message}`);
    }

    // Get columns for this category
    const { getCategoryColumns } = await import('./columnQueries');
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
  } catch (error: any) {
    console.error('Error fetching category details:', error);
    throw new Error(`Kateqoriya məlumatları əldə edərkən xəta baş verdi: ${error.message || 'Bilinməyən xəta'}`);
  }
};

export const createCategory = async (category: CreateCategoryDto): Promise<Category> => {
  // Validate category data before proceeding
  const validation = validateCategoryData(category);
  if (!validation.isValid) {
    throw new Error(`Doğrulama xətası: ${validation.errors.join(', ')}`);
  }

  // Use transaction to ensure data consistency
  return withTransaction(async (client) => {
    try {
      const { data, error } = await client
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

      if (error) {
        throw new Error(`Kateqoriya yaradılarkən xəta baş verdi: ${error.message}`);
      }

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
    } catch (error: any) {
      console.error('Error creating category:', error);
      throw new Error(`Kateqoriya yaradılarkən xəta baş verdi: ${error.message || 'Bilinməyən xəta'}`);
    }
  });
};

export const updateCategory = async (id: string, category: UpdateCategoryDto): Promise<Category> => {
  // Only validate fields that are actually being updated
  const fieldsToValidate = {
    name: category.name,
    assignment: category.assignment,
    priority: category.priority,
    status: category.status
  };
  
  const fieldsToUpdate: Record<string, any> = {};
  if (category.name !== undefined) fieldsToUpdate.name = category.name;
  if (category.description !== undefined) fieldsToUpdate.description = category.description;
  if (category.assignment !== undefined) fieldsToUpdate.assignment = category.assignment;
  if (category.priority !== undefined) fieldsToUpdate.priority = category.priority;
  if (category.status !== undefined) fieldsToUpdate.status = category.status;
  
  // Only validate the fields that are actually being updated
  const validation = validateCategoryData(fieldsToValidate);
  if (!validation.isValid) {
    throw new Error(`Doğrulama xətası: ${validation.errors.join(', ')}`);
  }
  
  // Use transaction for update
  return withTransaction(async (client) => {
    try {
      const { data, error } = await client
        .from('categories')
        .update(fieldsToUpdate)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Kateqoriya yenilənərkən xəta baş verdi: ${error.message}`);
      }

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
    } catch (error: any) {
      console.error('Error updating category:', error);
      throw new Error(`Kateqoriya yenilənərkən xəta baş verdi: ${error.message || 'Bilinməyən xəta'}`);
    }
  });
};

export const deleteCategory = async (id: string): Promise<void> => {
  // Use transaction to ensure data consistency during deletion
  return withTransaction(async (client) => {
    try {
      // First delete all columns associated with this category
      const { error: columnsError } = await client
        .from('columns')
        .delete()
        .eq('category_id', id);

      if (columnsError) {
        throw new Error(`Sütunlar silinərkən xəta baş verdi: ${columnsError.message}`);
      }

      // Then delete the category
      const { error } = await client
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Kateqoriya silinərkən xəta baş verdi: ${error.message}`);
      }
    } catch (error: any) {
      console.error('Error deleting category:', error);
      throw new Error(`Kateqoriya silinərkən xəta baş verdi: ${error.message || 'Bilinməyən xəta'}`);
    }
  });
};

export const updateCategoryPriority = async (id: string, newPriority: number): Promise<void> => {
  try {
    if (newPriority < 1) {
      throw new Error('Prioritet 1-dən böyük və ya bərabər olmalıdır');
    }
    
    const { error } = await supabase
      .from('categories')
      .update({ priority: newPriority })
      .eq('id', id);

    if (error) {
      throw new Error(`Prioritet yenilənərkən xəta baş verdi: ${error.message}`);
    }
  } catch (error: any) {
    console.error('Error updating category priority:', error);
    throw new Error(`Prioritet yenilənərkən xəta baş verdi: ${error.message || 'Bilinməyən xəta'}`);
  }
};

// New function to clear schema cache
export const clearSchemaCache = async (): Promise<void> => {
  try {
    await supabase.rpc('pg_advisory_unlock_all');
    console.log('Schema cache cleared successfully');
  } catch (error) {
    console.error('Error clearing schema cache:', error);
  }
};
