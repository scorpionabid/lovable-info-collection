
import { SchoolStats } from '../types';

/**
 * Get school completion statistics for charts
 */
export const getSchoolStats = async (schoolId: string): Promise<SchoolStats> => {
  try {
    // Mock data for completion history (6 months)
    const months = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'İyn'];
    const completionHistory = months.map(month => ({
      name: month,
      value: Math.floor(Math.random() * 40) + 60 // Random values between 60-100%
    }));

    // Mock data for categories
    const categoryNames = ['Müəllimlər', 'Maddi Texniki Baza', 'Maliyyə', 'Tədris Planı', 'Şagirdlər'];
    const categories = categoryNames.map(name => ({
      name,
      value: Math.floor(Math.random() * 40) + 60 // Random values between 60-100%
    }));

    return {
      completionHistory,
      categories
    };
  } catch (error) {
    console.error('Error fetching school stats:', error);
    throw error;
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
