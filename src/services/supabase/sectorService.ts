
import { supabase, Sector } from './supabaseClient';

const sectorService = {
  getSectors: async (regionId?: string) => {
    let query = supabase
      .from('sectors')
      .select('*')
      .order('name');
    
    if (regionId) {
      query = query.eq('region_id', regionId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data as Sector[];
  },
  
  getSectorById: async (id: string) => {
    const { data, error } = await supabase
      .from('sectors')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Sector;
  },
  
  createSector: async (sector: Omit<Sector, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('sectors')
      .insert([{ ...sector, created_at: new Date().toISOString() }])
      .select()
      .single();
    
    if (error) throw error;
    return data as Sector;
  },
  
  updateSector: async (id: string, sector: Partial<Omit<Sector, 'id' | 'created_at'>>) => {
    const { data, error } = await supabase
      .from('sectors')
      .update({ ...sector, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Sector;
  },
  
  deleteSector: async (id: string) => {
    const { error } = await supabase
      .from('sectors')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

export default sectorService;
