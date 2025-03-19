
import { supabase } from '../../supabaseClient';
import { SchoolStats } from '../types';

export const getSchoolStats = async (schoolId: string): Promise<SchoolStats> => {
  try {
    // Fetch student and teacher counts
    const { data: schoolData, error: schoolError } = await supabase
      .from('schools')
      .select('student_count, teacher_count')
      .eq('id', schoolId)
      .single();

    if (schoolError) throw schoolError;

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

    if (latestError) throw latestError;

    return {
      totalStudents: schoolData?.student_count || 0,
      totalTeachers: schoolData?.teacher_count || 0,
      completionRate,
      lastUpdate: latestData?.updated_at || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching school stats:', error);
    
    // Return default stats if error occurs
    return {
      totalStudents: 0,
      totalTeachers: 0,
      completionRate: 0,
      lastUpdate: new Date().toISOString()
    };
  }
};
