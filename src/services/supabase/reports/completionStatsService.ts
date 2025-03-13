
import { supabase } from '@/integrations/supabase/client';
import { CompletionStatistic, ReportParams, CriticalArea } from './types';

// Helper functions to adapt data formats
const calculateRegionCompletionRate = async (regionId: string, params?: ReportParams): Promise<number> => {
  try {
    // In a real application, this would be a complex calculation based on data entries
    // For now, we'll return a random value between 50% and 90%
    return Math.floor(Math.random() * 40) + 50;
  } catch (error) {
    console.error('Error calculating region completion rate:', error);
    return 0;
  }
};

const calculateCategoryCompletionRate = async (categoryId: string, params?: ReportParams): Promise<number> => {
  try {
    // In a real application, this would be a complex calculation based on data entries
    // For now, we'll return a random value between 40% and 95%
    return Math.floor(Math.random() * 55) + 40;
  } catch (error) {
    console.error('Error calculating category completion rate:', error);
    return 0;
  }
};

// Implement functions used in report components
export const getRegionCompletionData = async (categoryId: string, params?: any): Promise<any[]> => {
  try {
    // Get all regions
    const { data: regions, error: regionsError } = await supabase
      .from('regions')
      .select('id, name');

    if (regionsError) throw regionsError;

    // Calculate completion rate for each region (this would be a more complex query in a real app)
    const completionData = regions.map(region => ({
      id: region.id,
      name: region.name,
      value: Math.floor(Math.random() * 60) + 30 // Random value between 30-90%
    }));

    // Sort by completion rate descending
    return completionData.sort((a, b) => b.value - a.value);
  } catch (error) {
    console.error('Error getting region completion data:', error);
    return [];
  }
};

export const getCategoryCompletionData = async (regionId: string, params?: any): Promise<any[]> => {
  try {
    // Get all categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name');

    if (categoriesError) throw categoriesError;

    // Calculate completion rate for each category
    const completionData = categories.map(category => ({
      id: category.id,
      name: category.name,
      value: Math.floor(Math.random() * 70) + 25 // Random value between 25-95%
    }));

    // Sort by completion rate descending
    return completionData.sort((a, b) => b.value - a.value);
  } catch (error) {
    console.error('Error getting category completion data:', error);
    return [];
  }
};

export const getTimelineData = async (params?: any): Promise<any[]> => {
  // Define the months in Azerbaijani
  const months = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'İyun', 'İyul', 'Avq', 'Sen', 'Okt', 'Noy', 'Dek'];
  
  // Generate random completion rates for each month
  return months.map(month => ({
    id: month,
    name: month,
    value: Math.floor(Math.random() * 55) + 40 // Random value between 40-95%
  }));
};

export const getSubmissionStatusData = async (params?: any): Promise<any[]> => {
  // Generate random submission status data
  const onTime = Math.floor(Math.random() * 30) + 50; // 50-80%
  const late = Math.floor(Math.random() * 20) + 5; // 5-25%
  const incomplete = 100 - onTime - late;
  
  return [
    { id: 'ontime', name: 'Vaxtında', value: onTime },
    { id: 'late', name: 'Gecikmiş', value: late },
    { id: 'incomplete', name: 'Tamamlanmamış', value: incomplete }
  ];
};

export const getCriticalAreas = async (params?: ReportParams): Promise<CriticalArea[]> => {
  // Mock critical areas data
  return [
    {
      id: '1',
      name: 'Bakı məktəbləri',
      severity: 8,
      impact: 9,
      description: 'Critical issue with school data completion',
      region: 'Bakı',
      sector: 'Mərkəz',
      category: 'Ümumi məlumatlar',
      completionRate: 28,
      status: 'Gecikmiş'
    },
    {
      id: '2',
      name: 'Gəncə sektorları',
      severity: 7,
      impact: 7,
      description: 'Low completion rate for sectors',
      region: 'Gəncə',
      sector: 'Şimal',
      category: 'İnfrastruktur',
      completionRate: 36,
      status: 'Risk'
    },
    {
      id: '3',
      name: 'Sumqayıt məktəbləri',
      severity: 6,
      impact: 8,
      description: 'Late submissions for school data',
      region: 'Sumqayıt',
      sector: 'Mərkəz',
      category: 'Akademik göstəricilər',
      completionRate: 42,
      status: 'Risk'
    }
  ];
};

export const getCompletionData = async (params: any = {}) => {
  return {
    onTime: 78,
    late: 15,
    totalSubmitted: 93,
    onTimePercentage: 83.9
  };
};

export const getOnTimeSubmissionRate = async (params: any = {}) => {
  return {
    onTime: 78,
    late: 15,
    totalSubmitted: 93,
    onTimePercentage: 83.9
  };
};
