
import { supabase } from './baseClient';

/**
 * Get all regions for dropdown selection
 */
export const getRegionsForDropdown = async () => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .select('id, name')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching regions for dropdown:', error);
    throw error;
  }
};
