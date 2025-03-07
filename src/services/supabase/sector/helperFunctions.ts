
import { supabase } from '../supabaseClient';

/**
 * Get all regions formatted for dropdown selection
 */
export const getRegionsForDropdown = async () => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .select('id, name')
      .order('name');
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching regions for dropdown:', error);
    throw error;
  }
};

/**
 * Get sectors by region ID formatted for dropdown selection
 */
export const getSectorsByRegionId = async (regionId: string) => {
  try {
    const { data, error } = await supabase
      .from('sectors')
      .select('id, name')
      .eq('region_id', regionId)
      .eq('archived', false)
      .order('name');
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching sectors by region ID:', error);
    throw error;
  }
};

/**
 * Get schoolTypes formatted for dropdown selection
 */
export const getSchoolTypesForDropdown = async () => {
  try {
    const { data, error } = await supabase
      .from('school_types')
      .select('id, name')
      .order('name');
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching school types for dropdown:', error);
    throw error;
  }
};
