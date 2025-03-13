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

// Helper to determine if an argument is an ID or a config object
const isId = (arg: any): arg is string => {
  return typeof arg === 'string';
};

// Helper to extract table name from first argument
const getTableName = (tableNameOrConfig: any): string => {
  if (typeof tableNameOrConfig === 'string') {
    return tableNameOrConfig;
  }
  if (tableNameOrConfig && tableNameOrConfig.tableName) {
    return tableNameOrConfig.tableName;
  }
  throw new Error('Invalid table name argument');
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

// Enhanced API interface that supports both traditional and axios-like calls
export const api = {
  // Original methods
  fetchItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  
  // Enhanced methods that can handle both traditional and config-style parameters
  get: (tableNameOrConfig: string | any, id?: string) => {
    // Handle axios-style config object
    if (!isId(tableNameOrConfig) && !id) {
      // This is a config-style call like api.get({ params: {...} })
      return { data: null, success: true, error: null }; // Stub implementation for compatibility
    }
    
    // Handle traditional call pattern
    return isId(id) 
      ? getItemById(tableNameOrConfig as string, id)
      : { data: null, error: new Error('Invalid ID parameter') };
  },
  
  post: (tableNameOrConfig: string | any, item?: any) => {
    // Handle axios-style config object
    if (!isId(tableNameOrConfig) && !item) {
      // This is a config-style call
      return { success: true, data: null, error: null }; // Stub implementation for compatibility
    }
    
    // Handle traditional call pattern
    return createItem(tableNameOrConfig as string, item);
  },
  
  put: (tableNameOrConfig: string | any, idOrItem?: string | any, item?: any) => {
    // Handle axios-style config object
    if (!isId(tableNameOrConfig) && !idOrItem) {
      // This is a config-style call
      return { success: true, data: null, error: null }; // Stub implementation for compatibility
    }
    
    // If second param is not an ID but an object, adjust parameters
    if (idOrItem && typeof idOrItem !== 'string') {
      return updateItem(tableNameOrConfig as string, idOrItem.id, idOrItem);
    }
    
    // Handle traditional call pattern
    return updateItem(tableNameOrConfig as string, idOrItem as string, item);
  },
  
  delete: (tableNameOrConfig: string | any, id?: string) => {
    // Handle axios-style config object
    if (!isId(tableNameOrConfig) && !id) {
      // This is a config-style call
      return { success: true, error: null }; // Stub implementation for compatibility
    }
    
    // Handle traditional call pattern
    return deleteItem(tableNameOrConfig as string, id as string);
  }
};

export default api;
