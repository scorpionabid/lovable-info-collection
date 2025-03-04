
import { supabase } from '../supabaseClient';

export const getRegions = async (userId?: string, userRole?: string) => {
  try {
    let query = supabase.from('regions').select('*');
    
    if (userRole && userId && !userRole.includes('super')) {
      if (userRole.includes('region')) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('region_id')
          .eq('id', userId)
          .single();
          
        if (userError) throw userError;
        
        if (userData && userData.region_id) {
          query = query.eq('id', userData.region_id);
        }
      }
    }
    
    const { data, error } = await query;
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching regions:', error);
    throw error;
  }
};

export const getSectors = async (regionId?: string, userId?: string, userRole?: string) => {
  try {
    let query = supabase.from('sectors').select('*');
      
    if (regionId) {
      query = query.eq('region_id', regionId);
    } 
    else if (userRole && userId && !userRole.includes('super')) {
      if (userRole.includes('region')) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('region_id')
          .eq('id', userId)
          .single();
          
        if (userError) throw userError;
        
        if (userData && userData.region_id) {
          query = query.eq('region_id', userData.region_id);
        }
      } 
      else if (userRole.includes('sector')) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('sector_id')
          .eq('id', userId)
          .single();
          
        if (userError) throw userError;
        
        if (userData && userData.sector_id) {
          query = query.eq('id', userData.sector_id);
        }
      }
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching sectors:', error);
    throw error;
  }
};

export const getSchools = async (sectorId?: string, userId?: string, userRole?: string) => {
  try {
    let query = supabase.from('schools').select('*');
      
    if (sectorId) {
      query = query.eq('sector_id', sectorId);
    } 
    else if (userRole && userId && !userRole.includes('super')) {
      if (userRole.includes('region')) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('region_id')
          .eq('id', userId)
          .single();
          
        if (userError) throw userError;
        
        if (userData && userData.region_id) {
          const { data: sectorData, error: sectorError } = await supabase
            .from('sectors')
            .select('id')
            .eq('region_id', userData.region_id);
            
          if (sectorError) throw sectorError;
          
          if (sectorData && sectorData.length > 0) {
            const sectorIds = sectorData.map(s => s.id);
            query = query.in('sector_id', sectorIds);
          }
        }
      } 
      else if (userRole.includes('sector')) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('sector_id')
          .eq('id', userId)
          .single();
          
        if (userError) throw userError;
        
        if (userData && userData.sector_id) {
          query = query.eq('sector_id', userData.sector_id);
        }
      }
      else if (userRole.includes('school')) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('school_id')
          .eq('id', userId)
          .single();
          
        if (userError) throw userError;
        
        if (userData && userData.school_id) {
          query = query.eq('id', userData.school_id);
        }
      }
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching schools:', error);
    throw error;
  }
};

export const getRoles = async () => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('*');
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};
