
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export interface RegionData {
  id?: string;
  name: string;
  description?: string;
}

export interface RegionFilter {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

const buildQuery = (query: any, filters: RegionFilter) => {
  let modifiedQuery = query;
  
  if (filters.search) {
    modifiedQuery = modifiedQuery.ilike('name', `%${filters.search}%`);
  }
  
  if (filters.status) {
    modifiedQuery = modifiedQuery.eq('status', filters.status);
  }
  
  return modifiedQuery;
};

const regionService = {
  getRegions: async (filters: RegionFilter = {}) => {
    let query = supabase
      .from('regions')
      .select('*');
    
    query = buildQuery(query, filters);
    
    // Handle pagination
    if (filters.page !== undefined && filters.limit !== undefined) {
      const from = (filters.page - 1) * filters.limit;
      const to = from + filters.limit - 1;
      query = query.range(from, to);
    }
    
    query = query.order('name');
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },
  
  createRegion: async (regionData: RegionData) => {
    const { data, error } = await supabase
      .from('regions')
      .insert(regionData)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  getRegion: async (id: string) => {
    const { data, error } = await supabase
      .from('regions')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  updateRegion: async (id: string, regionData: Partial<RegionData>) => {
    const { data, error } = await supabase
      .from('regions')
      .update(regionData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  deleteRegion: async (id: string) => {
    const { error } = await supabase
      .from('regions')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return { success: true };
  }
};

export default regionService;
