
import { SchoolStats } from '../types';

/**
 * Get school completion statistics for charts
 */
export const getSchoolStats = async (schoolId: string): Promise<SchoolStats> => {
  try {
    // Fetch real statistics or generate placeholders
    
    // Return a valid SchoolStats object with both standard and UI-specific properties
    return {
      total_students: 250,
      total_teachers: 25,
      student_teacher_ratio: 10,
      completion_percentage: 85,
      last_updated: new Date().toISOString(),
      
      // UI specific properties used in charts
      categories: [
        { name: 'Əsas məlumatlar', value: 100 },
        { name: 'Tələbə məlumatları', value: 85 },
        { name: 'Müəllim məlumatları', value: 90 },
        { name: 'İnfrastruktur', value: 70 }
      ],
      completionHistory: [
        { name: 'Sentyabr', value: 60 },
        { name: 'Oktyabr', value: 75 },
        { name: 'Noyabr', value: 85 }
      ]
    };
  } catch (error) {
    console.error('Error fetching school stats:', error);
    
    // Return default stats if there's an error
    return {
      total_students: 0,
      total_teachers: 0,
      student_teacher_ratio: 0,
      completion_percentage: 0,
      last_updated: new Date().toISOString(),
      categories: [],
      completionHistory: []
    };
  }
};

/**
 * Get recent activities for a school
 */
export const getSchoolActivities = async (schoolId: string) => {
  try {
    // This would normally query an activities or audit log table
    // For now, returning mock data
    return [
      { id: 1, action: 'Müəllimlər kateqoriyası doldurulub', user: 'Əliyev Vüqar', time: '14:25, 12 May 2024' },
      { id: 2, action: 'Maddi Texniki Baza yenilənib', user: 'Əliyev Vüqar', time: '10:15, 10 May 2024' },
      { id: 3, action: 'Maliyyə hesabatı təsdiqlənib', user: 'Məmmədov Elnur', time: '16:40, 5 May 2024' },
      { id: 4, action: 'Şagird siyahısı yenilənib', user: 'Hüseynova Aysel', time: '09:30, 3 May 2024' }
    ];
  } catch (error) {
    console.error('Error fetching school activities:', error);
    throw error;
  }
};
