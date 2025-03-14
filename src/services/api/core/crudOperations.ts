
import { getTableQuery } from '../utils/tableOperations';
import { safeQuery } from '../utils/helpers';

// Type-safe querying with hardcoded table names to prevent errors
export const fetchItems = async (
  tableName: string,
  page = 1,
  pageSize = 10,
  filter = {},
  sortColumn = '',
  sortDirection = 'asc'
) => {
  return safeQuery(async () => {
    // Get the query builder for this table
    let query = getTableQuery(tableName).select('*');

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

    // Use count option for exact count
    const { data, error, count } = await query;
    return { data, count: count || 0, error };
  });
};

export const getItemById = async (tableName: string, id: string) => {
  if (!id) return { data: null, error: 'No ID provided' };

  return safeQuery(async () => {
    // Get the query builder for this table
    const query = getTableQuery(tableName).select('*');
    const { data, error } = await query.eq('id', id).single();
    return { data, error };
  });
};

export const createItem = async (tableName: string, item: any) => {
  return safeQuery(async () => {
    // Get the query builder for this table
    const query = getTableQuery(tableName);
    
    // Ensure we're using an array for insert
    const itemsArray = Array.isArray(item) ? item : [item];
    
    // Use a more generic type to avoid TypeScript errors
    const { data, error } = await (query as any).insert(itemsArray).select();
    
    // Return the first item from the array if successful
    return { 
      success: !error, 
      data: data && Array.isArray(data) && data.length > 0 ? data[0] : data, 
      error 
    };
  });
};

export const updateItem = async (tableName: string, id: string, item: any) => {
  return safeQuery(async () => {
    // Get the query builder for this table
    const query = getTableQuery(tableName);
    
    // Ensure we're updating a single item (not an array)
    const singleItem = Array.isArray(item) ? item[0] : item;
    
    // Use simple type assertion to bypass TypeScript errors
    const { data, error } = await (query as any)
      .update(singleItem)
      .eq('id', id)
      .select();
    
    // Return the first item from the array if successful
    return { 
      success: !error, 
      data: data && Array.isArray(data) && data.length > 0 ? data[0] : data, 
      error 
    };
  });
};

export const deleteItem = async (tableName: string, id: string) => {
  return safeQuery(async () => {
    // Get the query builder for this table
    const query = getTableQuery(tableName);
    const { error } = await query.delete().eq('id', id);
    return { success: !error, data: null, error };
  });
};
