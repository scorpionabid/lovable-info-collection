
import { supabase } from '../supabase/supabaseClient';

// API Base configuration - switched to use Supabase
const api = {
  auth: supabase.auth,
  db: supabase,
  
  // Custom request methods that maintain the same interface as before
  get: async (path: string, params?: any) => {
    const pathParts = path.split('/');
    const resource = pathParts[1]; // e.g., 'users' from '/users'
    const id = pathParts[2]; // e.g., '123' from '/users/123'
    
    let query = supabase.from(resource).select('*');
    
    if (id) {
      query = query.eq('id', id);
      const { data, error } = await query.single();
      if (error) throw error;
      return { data };
    }
    
    if (params) {
      // Apply filters
      Object.entries(params).forEach(([key, value]) => {
        if (key === 'limit') {
          query = query.limit(value as number);
        } else if (key === 'page') {
          const limit = params.limit || 10;
          const page = value as number;
          const from = (page - 1) * limit;
          const to = from + limit - 1;
          query = query.range(from, to);
        } else {
          query = query.eq(key, value);
        }
      });
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return { data };
  },
  
  post: async (path: string, body: any) => {
    const pathParts = path.split('/');
    const resource = pathParts[1]; // e.g., 'users' from '/users'
    
    const { data, error } = await supabase
      .from(resource)
      .insert([{ ...body, created_at: new Date().toISOString() }])
      .select()
      .single();
    
    if (error) throw error;
    return { data };
  },
  
  put: async (path: string, body: any) => {
    const pathParts = path.split('/');
    const resource = pathParts[1]; // e.g., 'users' from '/users'
    const id = pathParts[2]; // e.g., '123' from '/users/123'
    
    if (!id) throw new Error('ID is required for PUT requests');
    
    const { data, error } = await supabase
      .from(resource)
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { data };
  },
  
  delete: async (path: string) => {
    const pathParts = path.split('/');
    const resource = pathParts[1]; // e.g., 'users' from '/users'
    const id = pathParts[2]; // e.g., '123' from '/users/123'
    
    if (!id) throw new Error('ID is required for DELETE requests');
    
    const { error } = await supabase
      .from(resource)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { data: true };
  }
};

export default api;
