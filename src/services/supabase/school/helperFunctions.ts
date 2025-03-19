import { supabase } from '../supabaseClient';

/**
 * Get all school types
 */
export const getSchoolTypes = async (): Promise<{ id: string; name: string }[]> => {
  try {
    // Try to use the RPC function first
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_school_types');
    
    if (!rpcError && rpcData) {
      return rpcData;
    }
    
    // If RPC fails, fall back to direct query
    console.warn('RPC get_school_types failed, falling back to direct query', rpcError);
    
    const { data: queryData, error: queryError } = await supabase
      .from('school_types')
      .select('id, name')
      .order('name');
      
    if (queryError) throw queryError;
    return queryData || [];
  } catch (error) {
    console.error('Error fetching school types:', error);
    return [];
  }
};

/**
 * Get all schools by region ID
 */
export const getSchoolsByRegion = async (regionId: string) => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select(`
        id,
        name,
        type_id,
        address,
        region_id,
        sector_id,
        email,
        phone,
        director,
        student_count,
        teacher_count,
        status
      `)
      .eq('region_id', regionId)
      .order('name');
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching schools for region ${regionId}:`, error);
    return [];
  }
};

/**
 * Get all schools by sector ID
 */
export const getSchoolsBySector = async (sectorId: string) => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select(`
        id,
        name,
        type_id,
        address,
        region_id,
        sector_id,
        email,
        phone,
        director,
        student_count,
        teacher_count,
        status
      `)
      .eq('sector_id', sectorId)
      .order('name');
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching schools for sector ${sectorId}:`, error);
    return [];
  }
};

/**
 * Generate a unique school code
 * @returns The generated school code
 */
export const generateSchoolCode = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `SCH-${timestamp}-${random}`;
};
