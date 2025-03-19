
import { supabase } from './baseClient';

/**
 * Get school types for dropdown
 */
export const getSchoolTypes = async () => {
  try {
    console.log('Fetching school types...');
    
    // Use RPC instead of direct table query
    const { data, error } = await supabase.rpc('get_school_types');
    
    if (error) {
      console.error('Error fetching school types:', error);
      throw error;
    }

    console.log('Loaded school types:', data);
    return data || [];
  } catch (error) {
    console.error('Error in getSchoolTypes:', error);
    return [];
  }
};
