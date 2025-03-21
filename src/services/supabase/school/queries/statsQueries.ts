
import { supabase } from '../../supabaseClient';
import { SchoolStats } from '../types';

export const getSchoolStats = async (schoolId: string): Promise<SchoolStats> => {
  try {
    // Fetch school data - handling case when student_count/teacher_count might not exist yet
    const { data: schoolData, error: schoolError } = await supabase
      .from('schools')
      .select('student_count, teacher_count')
      .eq('id', schoolId)
      .single();

    if (schoolError) {
      console.warn('Could not fetch student/teacher counts, using defaults', schoolError);
      // Continue with defaults instead of throwing
    }

    // Calculate completion rate - in a real scenario, this would be based on
    // the percentage of completed data entries for the school
    // For now, we'll use a random number between 60-100 for demo
    const completionRate = Math.floor(Math.random() * 40) + 60;

    // Get the last update timestamp from the school data
    const { data: latestData, error: latestError } = await supabase
      .from('schools')
      .select('updated_at')
      .eq('id', schoolId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (latestError) {
      console.warn('Could not fetch last update time', latestError);
      // Continue with current date instead of throwing
    }

    return {
      total_students: schoolData?.student_count || 0,
      total_teachers: schoolData?.teacher_count || 0,
      completion_rate: completionRate,
      lastUpdate: latestData?.updated_at || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching school stats:', error);
    
    // Return default stats if error occurs
    return {
      total_students: 0,
      total_teachers: 0,
      completion_rate: 0,
      lastUpdate: new Date().toISOString()
    };
  }
};
