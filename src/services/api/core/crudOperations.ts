
import { getTableQuery } from '../utils/tableOperations';

// Type-safe querying with hardcoded table names to prevent errors
export const fetchItems = async (
  tableName: string,
  page = 1,
  pageSize = 10,
  filter = {},
  sortColumn = '',
  sortDirection = 'asc'
) => {
  try {
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

    const { data, error, count } = await query.select('*', { count: 'exact' });
    return { data, count: count || 0, error };
  } catch (error) {
    console.error(`Error fetching items from ${tableName}:`, error);
    return { data: [], count: 0, error };
  }
};

export const getItemById = async (tableName: string, id: string) => {
  if (!id) return { data: null, error: 'No ID provided' };

  try {
    // Get the query builder for this table
    const query = getTableQuery(tableName).select('*');
    const { data, error } = await query.eq('id', id).single();
    return { data, error };
  } catch (error) {
    console.error(`Error getting item by id from ${tableName}:`, error);
    return { data: null, error };
  }
};

export const createItem = async (tableName: string, item: any) => {
  try {
    // Get the query builder for this table
    const query = getTableQuery(tableName);
    const { data, error } = await query.insert(item).select().single();
    return { success: !error, data, error };
  } catch (error) {
    console.error(`Error creating item in ${tableName}:`, error);
    return { success: false, data: null, error };
  }
};

export const updateItem = async (tableName: string, id: string, item: any) => {
  try {
    // Get the query builder for this table
    const query = getTableQuery(tableName);
    const { data, error } = await query.update(item).eq('id', id).select().single();
    return { success: !error, data, error };
  } catch (error) {
    console.error(`Error updating item in ${tableName}:`, error);
    return { success: false, data: null, error };
  }
};

export const deleteItem = async (tableName: string, id: string) => {
  try {
    // Get the query builder for this table
    const query = getTableQuery(tableName);
    const { error } = await query.delete().eq('id', id);
    return { success: !error, data: null, error };
  } catch (error) {
    console.error(`Error deleting item from ${tableName}:`, error);
    return { success: false, data: null, error };
  }
};
