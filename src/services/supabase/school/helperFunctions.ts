
import { supabase } from './baseClient';

/**
 * Get all school types for dropdown selection
 */
export const getSchoolTypes = async () => {
  try {
    const { data, error } = await supabase
      .from('school_types')
      .select('id, name')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching school types:', error);
    throw error;
  }
};

/**
 * Export school data to Excel (placeholder function)
 */
export const exportSchoolData = async (schoolId: string) => {
  try {
    // This would use a utility to export data to Excel
    console.log(`Exporting data for school: ${schoolId}`);
    // Return true to indicate success
    return true;
  } catch (error) {
    console.error('Error exporting school data:', error);
    throw error;
  }
};

/**
 * Assign an administrator to a school
 */
export const assignSchoolAdmin = async (schoolId: string, userId: string) => {
  try {
    // This would update the users table to associate the admin with this school
    console.log(`Assigning user ${userId} as admin for school: ${schoolId}`);
    
    // Update the user record with the school_id
    const { data, error } = await supabase
      .from('users')
      .update({ school_id: schoolId })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error assigning school admin:', error);
    throw error;
  }
};
