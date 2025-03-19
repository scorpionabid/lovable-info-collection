
import { supabase } from '../supabaseClient';

/**
 * Retrieves the recent activities for a specific school
 * @param schoolId - The ID of the school
 * @returns An array of activities for the specified school
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

    // Transform and enrich the activities data
    const activities = data.map(log => ({
      id: log.id,
      action: log.action,
      user_id: log.user_id,
      performed_at: log.created_at,
      details: log.new_data ? JSON.stringify(log.new_data) : undefined,
      metadata: log.metadata
    }));

    return activities;
  } catch (error) {
    console.error("Error fetching school activities:", error);
    return [];
  }
};
