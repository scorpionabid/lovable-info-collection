
import { supabase, Region } from './supabaseClient';

const regionService = {
  getRegions: async () => {
    const { data, error } = await supabase
      .from('regions')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data as Region[];
  },
  
  getRegionById: async (id: string) => {
    const { data, error } = await supabase
      .from('regions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Region;
  },
  
  createRegion: async (region: Omit<Region, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('regions')
      .insert([{ ...region, created_at: new Date().toISOString() }])
      .select()
      .single();
    
    if (error) throw error;
    return data as Region;
  },
  
  updateRegion: async (id: string, region: Partial<Omit<Region, 'id' | 'created_at'>>) => {
    const { data, error } = await supabase
      .from('regions')
      .update({ ...region, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Region;
  },
  
  deleteRegion: async (id: string) => {
    const { error } = await supabase
      .from('regions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

export default regionService;
