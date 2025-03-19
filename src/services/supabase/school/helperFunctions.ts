import { supabase } from '../supabaseClient';

/**
 * Get school types from the database.
 * This is a direct method that doesn't depend on Table row existence
 */
export const getSchoolTypes = async (): Promise<{ id: string; name: string }[]> => {
  try {
    // Try to use the get_school_types() function if it exists
    const { data: fnData, error: fnError } = await supabase.rpc('get_school_types');
    
    if (!fnError && fnData) {
      return fnData;
    }
    
    // Otherwise, fetch directly from the table
    const { data, error } = await supabase
      .rpc('get_school_types');
    
    if (error) {
      console.error('Error fetching school types:', error);
      
      // Fallback to hardcoded types if the database query fails
      return [
        { id: '1', name: 'Tam orta məktəb' },
        { id: '2', name: 'Ümumi orta məktəb' },
        { id: '3', name: 'İbtidai məktəb' },
        { id: '4', name: 'Lisey' },
        { id: '5', name: 'Gimnaziya' }
      ];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getSchoolTypes:', error);
    
    // Return dummy data in case of error
    return [
      { id: '1', name: 'Tam orta məktəb' },
      { id: '2', name: 'Ümumi orta məktəb' },
      { id: '3', name: 'İbtidai məktəb' },
      { id: '4', name: 'Lisey' },
      { id: '5', name: 'Gimnaziya' }
    ];
  }
};

/**
 * Check if a school with the given name already exists.
 */
export const schoolNameExists = async (name: string, excludeId?: string): Promise<boolean> => {
  try {
    let query = supabase
      .from('schools')
      .select('id')
      .ilike('name', name);
    
    if (excludeId) {
      query = query.neq('id', excludeId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error checking if school name exists:', error);
      return false;
    }
    
    return (data || []).length > 0;
  } catch (error) {
    console.error('Error in schoolNameExists:', error);
    return false;
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
