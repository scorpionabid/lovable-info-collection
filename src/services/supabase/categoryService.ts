
import { supabase, Category, Column, CalculatedColumn } from './supabaseClient';

const categoryService = {
  getCategories: async (filters?: { status?: string; assignment?: string }) => {
    let query = supabase
      .from('categories')
      .select('*')
      .order('priority');
    
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters?.assignment) {
      query = query.eq('assignment', filters.assignment);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data as Category[];
  },
  
  getCategoryById: async (id: string) => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Category;
  },
  
  createCategory: async (category: Omit<Category, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ ...category, created_at: new Date().toISOString() }])
      .select()
      .single();
    
    if (error) throw error;
    return data as Category;
  },
  
  updateCategory: async (id: string, category: Partial<Omit<Category, 'id' | 'created_at'>>) => {
    const { data, error } = await supabase
      .from('categories')
      .update({ ...category, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Category;
  },
  
  deleteCategory: async (id: string) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },
  
  // Column management
  getCategoryColumns: async (categoryId: string) => {
    const { data, error } = await supabase
      .from('columns')
      .select('*')
      .eq('category_id', categoryId)
      .order('order');
    
    if (error) throw error;
    return data as Column[];
  },
  
  createColumn: async (column: Omit<Column, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('columns')
      .insert([{ ...column, created_at: new Date().toISOString() }])
      .select()
      .single();
    
    if (error) throw error;
    return data as Column;
  },
  
  updateColumn: async (id: string, column: Partial<Omit<Column, 'id' | 'created_at'>>) => {
    const { data, error } = await supabase
      .from('columns')
      .update({ ...column, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Column;
  },
  
  deleteColumn: async (id: string) => {
    const { error } = await supabase
      .from('columns')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },
  
  // Calculated columns
  getCalculatedColumns: async (categoryId: string) => {
    const { data, error } = await supabase
      .from('calculated_columns')
      .select('*')
      .eq('category_id', categoryId)
      .order('order');
    
    if (error) throw error;
    return data as CalculatedColumn[];
  },
  
  createCalculatedColumn: async (column: Omit<CalculatedColumn, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('calculated_columns')
      .insert([{ ...column, created_at: new Date().toISOString() }])
      .select()
      .single();
    
    if (error) throw error;
    return data as CalculatedColumn;
  },
  
  updateCalculatedColumn: async (id: string, column: Partial<Omit<CalculatedColumn, 'id' | 'created_at'>>) => {
    const { data, error } = await supabase
      .from('calculated_columns')
      .update({ ...column, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as CalculatedColumn;
  },
  
  deleteCalculatedColumn: async (id: string) => {
    const { error } = await supabase
      .from('calculated_columns')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

export default categoryService;
