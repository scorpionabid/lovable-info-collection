
import { supabase } from '../client';

/**
 * Get recent activities/audit logs for a specific school
 * @param schoolId School ID
 * @returns List of recent activities
 */
export const getSchoolActivities = async (schoolId: string) => {
  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('table_name', 'schools')
      .eq('record_id', schoolId)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error(`Error fetching school activities for ${schoolId}:`, error);
    return [];
  }
};
