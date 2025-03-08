
import { supabase } from './baseClient';

/**
 * Get school types for dropdown
 */
export const getSchoolTypes = async () => {
  try {
    console.log('Fetching school types...');
    
    const { data, error } = await supabase
      .from('school_types')
      .select('id, name')
      .order('name', { ascending: true });
    
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
