
import { supabase } from '@/integrations/supabase/client';

// This is a generic API service for handling common CRUD operations

// Generic fetch function with pagination and filtering
export const fetchItems = async (
  tableName: string, 
  page = 1, 
  pageSize = 10, 
  filter = {}, 
  sortColumn = 'created_at', 
  sortDirection = 'desc'
) => {
  try {
    // Calculate offset
    const offset = (page - 1) * pageSize;
    
    // Build query
    // This is an example of using string interpolation for table names
    // This should be safe as the tableName comes from our code, not user input
    // However, this might cause TypeScript errors since the table might not be recognized
    let query = supabase
      .from(tableName as any)
      .select('*', { count: 'exact' });
    
    // Apply filters
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (key.includes('.')) {
          // Handle relationship filters
          const [relation, field] = key.split('.');
          query = query.eq(`${relation}.${field}`, value);
        } else if (typeof value === 'string' && value.includes('%')) {
          // Handle LIKE queries
          query = query.ilike(key, value);
        } else {
          // Handle exact matches
          query = query.eq(key, value);
        }
      }
    });
    
    // Apply sorting
    query = query.order(sortColumn, { ascending: sortDirection === 'asc' });
    
    // Apply pagination
    query = query.range(offset, offset + pageSize - 1);
    
    // Execute query
    const { data, count, error } = await query;
    
    if (error) throw error;
    
    return { data, count, error: null };
  } catch (error) {
    console.error(`Error fetching items from ${tableName}:`, error);
    return { data: null, count: 0, error };
  }
};

// Generic get by ID
export const getItemById = async (tableName: string, id: string) => {
  try {
    const { data, error } = await supabase
      .from(tableName as any)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error(`Error fetching item from ${tableName}:`, error);
    return { data: null, error };
  }
};

// Generic create
export const createItem = async (tableName: string, item: Record<string, any>) => {
  try {
    const { data, error } = await supabase
      .from(tableName as any)
      .insert(item)
      .select();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error(`Error creating item in ${tableName}:`, error);
    return { data: null, error };
  }
};

// Generic update
export const updateItem = async (tableName: string, id: string, updates: Record<string, any>) => {
  try {
    const { data, error } = await supabase
      .from(tableName as any)
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error(`Error updating item in ${tableName}:`, error);
    return { data: null, error };
  }
};

// Generic delete
export const deleteItem = async (tableName: string, id: string) => {
  try {
    const { data, error } = await supabase
      .from(tableName as any)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error(`Error deleting item from ${tableName}:`, error);
    return { success: false, error };
  }
};

export default {
  fetchItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
};
