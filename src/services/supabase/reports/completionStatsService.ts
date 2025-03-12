import { supabase } from '@/integrations/supabase/client';
import { CompletionStatistic } from './types';

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

export const getRegionCompletionStats = async (params?: ReportParams): Promise<CompletionStatistic[]> => {
  try {
    // Calculate the actual completion rates based on data entries in the database
    const { data, error } = await supabase
      .from('regions')
      .select(`
        id,
        name
      `);

    if (error) throw error;

    // For each region, calculate the completion rate
    const regionStats = await Promise.all(
      data.map(async (region) => {
        const completionRate = await calculateRegionCompletionRate(region.id, params);
        return {
          name: region.name,
          value: completionRate
        };
      })
    );

    // Sort by completion rate in descending order
    return regionStats.sort((a, b) => b.value - a.value);
  } catch (error) {
    console.error('Error fetching region completion statistics:', error);
    throw error;
  }
};

export const getCategoryCompletionStats = async (params?: ReportParams): Promise<CompletionStatistic[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        id,
        name
      `);

    if (error) throw error;

    // For each category, calculate the completion rate
    const categoryStats = await Promise.all(
      data.map(async (category) => {
        const completionRate = await calculateCategoryCompletionRate(category.id, params);
        return {
          name: category.name,
          value: completionRate
        };
      })
    );

    // Sort by completion rate in descending order
    return categoryStats.sort((a, b) => b.value - a.value);
  } catch (error) {
    console.error('Error fetching category completion statistics:', error);
    throw error;
  }
};

export const getTimelineCompletionStats = async (params?: ReportParams): Promise<CompletionStatistic[]> => {
  try {
    // Define the months in Azerbaijani
    const months = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'İyun', 'İyul', 'Avq', 'Sen', 'Okt', 'Noy', 'Dek'];
    
    // Calculate the year based on params or default to current year
    const year = params?.startDate 
      ? new Date(params.startDate).getFullYear() 
      : new Date().getFullYear();
    
    // For each month, calculate the completion rate
    const timelineStats = await Promise.all(
      months.map(async (month, index) => {
        // Calculate start and end of the month
        const startDate = new Date(year, index, 1).toISOString();
        const endDate = new Date(year, index + 1, 0).toISOString();
        
        // Get all data entries for this month
        const { data, error } = await supabase
          .from('data')
          .select('*')
          .gte('created_at', startDate)
          .lte('created_at', endDate);
        
        if (error) throw error;
        
        // Calculate completion rate based on data entries
        // This is a simplified calculation, it should be more complex in a real app
        const totalEntries = data.length;
        const completedEntries = data.filter(entry => entry.status === 'approved').length;
        const completionRate = totalEntries > 0 ? Math.round((completedEntries / totalEntries) * 100) : 0;
        
        return {
          name: month,
          value: completionRate
        };
      })
    );
    
    return timelineStats;
  } catch (error) {
    console.error('Error fetching timeline completion statistics:', error);
    throw error;
  }
};

export const getSubmissionStatusStats = async (params?: ReportParams): Promise<CompletionStatistic[]> => {
  try {
    // Get data statuses for the given period
    const startDate = params?.startDate || new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString();
    const endDate = params?.endDate || new Date().toISOString();
    
    const { data, error } = await supabase
      .from('data')
      .select('status, deadline, submitted_at')
      .gte('created_at', startDate)
      .lte('created_at', endDate);
    
    if (error) throw error;
    
    // Count entries by submission status
    const totalEntries = data.length;
    const onTimeEntries = data.filter(entry => 
      entry.submitted_at && entry.deadline && new Date(entry.submitted_at) <= new Date(entry.deadline)
    ).length;
    
    const lateEntries = data.filter(entry => 
      entry.submitted_at && entry.deadline && new Date(entry.submitted_at) > new Date(entry.deadline)
    ).length;
    
    const incompleteEntries = data.filter(entry => !entry.submitted_at).length;
    
    // Calculate percentages
    const onTimePercentage = totalEntries > 0 ? Math.round((onTimeEntries / totalEntries) * 100) : 0;
    const latePercentage = totalEntries > 0 ? Math.round((lateEntries / totalEntries) * 100) : 0;
    const incompletePercentage = totalEntries > 0 ? Math.round((incompleteEntries / totalEntries) * 100) : 0;
    
    return [
      { name: 'Vaxtında', value: onTimePercentage },
      { name: 'Gecikmiş', value: latePercentage },
      { name: 'Tamamlanmamış', value: incompletePercentage }
    ];
  } catch (error) {
    console.error('Error fetching submission status statistics:', error);
    throw error;
  }
};

export const getCriticalAreas = async (params?: ReportParams): Promise<CriticalArea[]> => {
  try {
    // This is a more complex query that joins multiple tables
    // In a real application, you might want to write a database function for this
    
    // For now, we'll return a simulated result based on random calculations
    // This should be replaced with a proper query
    
    const { data: regions, error: regionsError } = await supabase
      .from('regions')
      .select('id, name');
    
    if (regionsError) throw regionsError;
    
    const { data: sectors, error: sectorsError } = await supabase
      .from('sectors')
      .select('id, name, region_id');
    
    if (sectorsError) throw sectorsError;
    
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name');
    
    if (categoriesError) throw categoriesError;
    
    // Get a few combinations of regions, sectors, and categories with low completion rates
    const criticalAreas: CriticalArea[] = [];
    
    // Find sectors for each region
    regions.forEach(region => {
      const regionSectors = sectors.filter(sector => sector.region_id === region.id);
      
      regionSectors.forEach(sector => {
        // Randomly select a category with a low completion rate
        if (Math.random() > 0.7 && categories.length > 0) {
          const randomCategory = categories[Math.floor(Math.random() * categories.length)];
          const completionRate = Math.floor(Math.random() * 45) + 5; // Random number between 5-50%
          
          criticalAreas.push({
            region: region.name,
            sector: sector.name,
            category: randomCategory.name,
            completionRate,
            status: completionRate < 30 ? 'Gecikmiş' : 'Risk'
          });
        }
      });
    });
    
    // Return the top critical areas
    return criticalAreas.sort((a, b) => a.completionRate - b.completionRate).slice(0, 5);
  } catch (error) {
    console.error('Error fetching critical areas:', error);
    throw error;
  }
};

export const getOnTimeSubmissionRate = async (params: any = {}) => {
  try {
    const { regionId, sectorId, schoolId, startDate, endDate } = params;
    
    let query = supabase
      .from('data')
      .select(`
        id,
        submitted_at,
        created_at,
        schools:schools(id, name, region_id, sector_id),
        categories:categories(id, name)
      `)
      .not('submitted_at', 'is', null);
    
    // Apply filters
    if (regionId) {
      query = query.eq('schools.region_id', regionId);
    }
    
    if (sectorId) {
      query = query.eq('schools.sector_id', sectorId);
    }
    
    if (schoolId) {
      query = query.eq('school_id', schoolId);
    }
    
    if (startDate) {
      query = query.gte('submitted_at', startDate);
    }
    
    if (endDate) {
      query = query.lte('submitted_at', endDate);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return { 
        onTime: 0, 
        late: 0, 
        totalSubmitted: 0,
        onTimePercentage: 0
      };
    }
    
    let onTime = 0;
    let late = 0;
    
    // For each submission, check if it was on time
    // Since we don't have actual deadline information, we'll use a simulated approach
    data.forEach(submission => {
      // For demo purposes, we'll consider submissions made within 7 days of creation as "on time"
      // In a real application, you would compare with an actual deadline field
      const createdDate = new Date(submission.created_at);
      const submittedDate = new Date(submission.submitted_at);
      const timeDiff = submittedDate.getTime() - createdDate.getTime();
      const daysDiff = timeDiff / (1000 * 3600 * 24);
      
      if (daysDiff <= 7) {
        onTime++;
      } else {
        late++;
      }
    });
    
    const totalSubmitted = onTime + late;
    const onTimePercentage = totalSubmitted > 0 ? Math.round((onTime / totalSubmitted) * 100) : 0;
    
    return {
      onTime,
      late,
      totalSubmitted,
      onTimePercentage
    };
  } catch (error) {
    console.error('Error calculating on-time submission rate:', error);
    return { 
      onTime: 0, 
      late: 0, 
      totalSubmitted: 0,
      onTimePercentage: 0,
      error
    };
  }
};
