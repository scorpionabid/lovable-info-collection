
import { supabase } from '@/integrations/supabase/client';

/**
 * Generic API service for CRUD operations
 */
export const api = {
  fetchItems: async (tableName: string, page = 1, pageSize = 10, filter = {}, sortColumn = '', sortDirection = 'desc') => {
    try {
      // Calculate the range for pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      // Build the query
      let query = supabase
        .from(tableName)
        .select('*', { count: 'exact' });
      
      // Apply filters
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          if (typeof value === 'string' && value.includes('%')) {
            query = query.ilike(key, value);
          } else {
            query = query.eq(key, value);
          }
        }
      });
      
      // Apply sorting
      if (sortColumn) {
        query = query.order(sortColumn, { ascending: sortDirection === 'asc' });
      } else {
        // Default sort is by creation date
        query = query.order('created_at', { ascending: false });
      }
      
      // Apply pagination
      query = query.range(from, to);
      
      // Execute query
      const { data, count, error } = await query;
      
      if (error) throw error;
      
      return { data, count: count || 0, error: null };
    } catch (error) {
      console.error(`Error fetching ${tableName}:`, error);
      return { data: [], count: 0, error };
    }
  },

  getItemById: async (tableName: string, id: string) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error(`Error fetching ${tableName} item:`, error);
      return { data: null, error };
    }
  },

  // HTTP method-like interfaces for better readability
  get: async (endpoint: string, params = {}) => {
    // For endpoints like 'regions', 'categories/123/columns', etc.
    try {
      const [tableName, id, relation] = endpoint.split('/');
      
      if (!id && !relation) {
        // Fetching a list
        return api.fetchItems(tableName, params.page, params.pageSize, params.filter, params.sortColumn, params.sortDirection);
      } else if (id && !relation) {
        // Fetching a single item
        return api.getItemById(tableName, id);
      } else if (id && relation) {
        // Fetching related items
        const { data: parent, error: parentError } = await api.getItemById(tableName, id);
        
        if (parentError) throw parentError;
        
        const { data: related, error: relatedError } = await supabase
          .from(relation)
          .select('*')
          .eq(`${tableName.slice(0, -1)}_id`, id);
        
        if (relatedError) throw relatedError;
        
        return { data: { parent, related }, error: null };
      }
    } catch (error) {
      console.error(`Error in GET request for ${endpoint}:`, error);
      return { data: null, error };
    }
  },

  post: async (endpoint: string, data = {}) => {
    try {
      const tableName = endpoint.split('/')[0];
      
      const { data: result, error } = await supabase
        .from(tableName)
        .insert(data)
        .select();
      
      if (error) throw error;
      
      return { data: result, error: null };
    } catch (error) {
      console.error(`Error in POST request for ${endpoint}:`, error);
      return { data: null, error };
    }
  },

  put: async (endpoint: string, data = {}) => {
    try {
      const [tableName, id] = endpoint.split('/');
      
      if (!id) {
        throw new Error('ID is required for PUT requests');
      }
      
      const { data: result, error } = await supabase
        .from(tableName)
        .update(data)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      return { data: result, error: null };
    } catch (error) {
      console.error(`Error in PUT request for ${endpoint}:`, error);
      return { data: null, error };
    }
  },

  delete: async (endpoint: string) => {
    try {
      const [tableName, id] = endpoint.split('/');
      
      if (!id) {
        throw new Error('ID is required for DELETE requests');
      }
      
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return { success: true, error: null };
    } catch (error) {
      console.error(`Error in DELETE request for ${endpoint}:`, error);
      return { success: false, error };
    }
  }
};

export default api;
