
import { supabase, School } from './supabaseClient';

const schoolService = {
  getSchools: async (filters?: { regionId?: string; sectorId?: string; typeId?: string; status?: string }) => {
    let query = supabase
      .from('schools')
      .select('*')
      .order('name');
    
    if (filters?.regionId) {
      query = query.eq('region_id', filters.regionId);
    }
    
    if (filters?.sectorId) {
      query = query.eq('sector_id', filters.sectorId);
    }
    
    if (filters?.typeId) {
      query = query.eq('type_id', filters.typeId);
    }
    
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data as School[];
  },
  
  getSchoolById: async (id: string) => {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as School;
  },
  
  createSchool: async (school: Omit<School, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('schools')
      .insert([{ ...school, created_at: new Date().toISOString() }])
      .select()
      .single();
    
    if (error) throw error;
    return data as School;
  },
  
  updateSchool: async (id: string, school: Partial<Omit<School, 'id' | 'created_at'>>) => {
    const { data, error } = await supabase
      .from('schools')
      .update({ ...school, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as School;
  },
  
  deleteSchool: async (id: string) => {
    const { error } = await supabase
      .from('schools')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },
  
  // Import and export functions can be implemented here
  importSchools: async (schools: Omit<School, 'id' | 'created_at'>[]) => {
    const { data, error } = await supabase
      .from('schools')
      .insert(schools.map(school => ({ 
        ...school, 
        created_at: new Date().toISOString() 
      })))
      .select();
    
    if (error) throw error;
    return data as School[];
  }
};

export default schoolService;
