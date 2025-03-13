
import { supabase } from '@/integrations/supabase/client';

// Utility function to safely execute a query with error handling
const safeQuery = async (fn: () => Promise<any>) => {
  try {
    return await fn();
  } catch (error) {
    console.error('API query error:', error);
    return { data: null, error };
  }
};

// Type-safe querying with hardcoded table names to prevent errors
export const fetchItems = async (
  tableName: string,
  page = 1,
  pageSize = 10,
  filter = {},
  sortColumn = '',
  sortDirection = 'asc'
) => {
  // Use a safer approach that doesn't rely on dynamic table names
  let query: any;
  
  // Start with a hardcoded switch statement for known tables
  switch (tableName) {
    case 'categories':
      query = supabase.from('categories').select('*');
      break;
    case 'regions':
      query = supabase.from('regions').select('*');
      break;
    case 'sectors':
      query = supabase.from('sectors').select('*');
      break;
    case 'schools':
      query = supabase.from('schools').select('*');
      break;
    case 'users':
      query = supabase.from('users').select('*');
      break;
    case 'data':
      query = supabase.from('data').select('*');
      break;
    case 'columns':
      query = supabase.from('columns').select('*');
      break;
    default:
      console.error(`Unknown table: ${tableName}`);
      return { data: [], count: 0, error: `Unknown table: ${tableName}` };
  }

  // Apply pagination
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;
  query = query.range(start, end);

  // Apply sorting if provided
  if (sortColumn) {
    query = query.order(sortColumn, { ascending: sortDirection === 'asc' });
  }

  // Apply filters
  if (filter && typeof filter === 'object') {
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (typeof value === 'string' && value.includes('%')) {
          query = query.ilike(key, value);
        } else {
          query = query.eq(key, value);
        }
      }
    });
  }

  const { data, error, count } = await query.select('*', { count: 'exact' });
  return { data, count: count || 0, error };
};

export const getItemById = async (tableName: string, id: string) => {
  if (!id) return { data: null, error: 'No ID provided' };

  // Use a safer approach that doesn't rely on dynamic table names
  let query: any;
  
  switch (tableName) {
    case 'categories':
      query = supabase.from('categories').select('*');
      break;
    case 'regions':
      query = supabase.from('regions').select('*');
      break;
    case 'sectors':
      query = supabase.from('sectors').select('*');
      break;
    case 'schools':
      query = supabase.from('schools').select('*');
      break;
    case 'users':
      query = supabase.from('users').select('*');
      break;
    case 'data':
      query = supabase.from('data').select('*');
      break;
    case 'columns':
      query = supabase.from('columns').select('*');
      break;
    default:
      console.error(`Unknown table: ${tableName}`);
      return { data: null, error: `Unknown table: ${tableName}` };
  }

  const { data, error } = await query.eq('id', id).single();
  return { data, error };
};

export const createItem = async (tableName: string, item: any) => {
  // Use a safer approach that doesn't rely on dynamic table names
  let query: any;
  
  switch (tableName) {
    case 'categories':
      query = supabase.from('categories');
      break;
    case 'regions':
      query = supabase.from('regions');
      break;
    case 'sectors':
      query = supabase.from('sectors');
      break;
    case 'schools':
      query = supabase.from('schools');
      break;
    case 'users':
      query = supabase.from('users');
      break;
    case 'data':
      query = supabase.from('data');
      break;
    case 'columns':
      query = supabase.from('columns');
      break;
    default:
      console.error(`Unknown table: ${tableName}`);
      return { success: false, error: `Unknown table: ${tableName}` };
  }

  const { data, error } = await query.insert(item).select().single();
  return { success: !error, data, error };
};

export const updateItem = async (tableName: string, id: string, item: any) => {
  // Use a safer approach that doesn't rely on dynamic table names
  let query: any;
  
  switch (tableName) {
    case 'categories':
      query = supabase.from('categories');
      break;
    case 'regions':
      query = supabase.from('regions');
      break;
    case 'sectors':
      query = supabase.from('sectors');
      break;
    case 'schools':
      query = supabase.from('schools');
      break;
    case 'users':
      query = supabase.from('users');
      break;
    case 'data':
      query = supabase.from('data');
      break;
    case 'columns':
      query = supabase.from('columns');
      break;
    default:
      console.error(`Unknown table: ${tableName}`);
      return { success: false, error: `Unknown table: ${tableName}` };
  }

  const { data, error } = await query.update(item).eq('id', id).select().single();
  return { success: !error, data, error };
};

export const deleteItem = async (tableName: string, id: string) => {
  // Use a safer approach that doesn't rely on dynamic table names
  let query: any;
  
  switch (tableName) {
    case 'categories':
      query = supabase.from('categories');
      break;
    case 'regions':
      query = supabase.from('regions');
      break;
    case 'sectors':
      query = supabase.from('sectors');
      break;
    case 'schools':
      query = supabase.from('schools');
      break;
    case 'users':
      query = supabase.from('users');
      break;
    case 'data':
      query = supabase.from('data');
      break;
    case 'columns':
      query = supabase.from('columns');
      break;
    default:
      console.error(`Unknown table: ${tableName}`);
      return { success: false, error: `Unknown table: ${tableName}` };
  }

  const { error } = await query.delete().eq('id', id);
  return { success: !error, error };
};

// For backwards compatibility
export const api = {
  fetchItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  get: getItemById,
  post: createItem,
  put: updateItem,
  delete: deleteItem
};

export default api;
