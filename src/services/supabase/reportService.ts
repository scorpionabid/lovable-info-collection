
import { supabase } from './supabaseClient';
import { fileExport } from '@/utils/fileExport';

// Types
export interface CompletionStatistic {
  name: string;
  value: number;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  change?: number;
}

export interface RegionPerformance {
  region: string;
  sector: string;
  performance: number;
  onTimeSubmission: number;
  quality: number;
  change: number;
}

export interface ComparisonData {
  category: string;
  previousYear: number;
  currentYear: number;
  change: number;
}

export interface CriticalArea {
  region: string;
  sector: string;
  category: string;
  completionRate: number;
  status: 'Gecikmiş' | 'Risk' | 'Normal';
}

export interface ReportParams {
  filter?: string;
  regionId?: string;
  sectorId?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  periodType?: 'week' | 'month' | 'quarter' | 'year';
}

export interface CustomReportDefinition {
  id?: string;
  name: string;
  description?: string;
  reportType: string;
  parameters: Record<string, any>;
  visualType: 'table' | 'bar' | 'line' | 'pie';
  createdBy?: string;
  createdAt?: string;
}

// Completion Statistics Report
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

// Performance Analysis Report
export const getPerformanceMetrics = async (params?: ReportParams): Promise<PerformanceMetric[]> => {
  try {
    // Calculate overall performance metrics
    // In a real application, these would be calculated based on complex queries
    
    // For now, we'll return simulated metrics
    return [
      { 
        name: 'Ümumi performans göstəricisi', 
        value: 85, 
        change: 5 
      },
      { 
        name: 'Vaxtında təqdim olunma', 
        value: 92, 
        change: 3 
      },
      { 
        name: 'Məlumat keyfiyyəti', 
        value: 78, 
        change: -2 
      }
    ];
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    throw error;
  }
};

export const getRegionPerformanceRanking = async (params?: ReportParams): Promise<CompletionStatistic[]> => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .select('id, name');
    
    if (error) throw error;
    
    // For each region, calculate the performance rate
    const performanceRanking = await Promise.all(
      data.map(async (region) => {
        // This would be a complex calculation in a real app
        // For now, we'll simulate a performance score
        const performanceScore = Math.floor(Math.random() * 30) + 65; // Random number between 65-95%
        
        return {
          name: region.name,
          value: performanceScore
        };
      })
    );
    
    // Sort by performance score in descending order
    return performanceRanking.sort((a, b) => b.value - a.value);
  } catch (error) {
    console.error('Error fetching region performance ranking:', error);
    throw error;
  }
};

export const getPerformanceTrend = async (params?: ReportParams): Promise<CompletionStatistic[]> => {
  try {
    // Get performance data for the last 8 weeks
    // In a real app, this would be based on actual data points
    
    const weeks = ['Həftə 1', 'Həftə 2', 'Həftə 3', 'Həftə 4', 'Həftə 5', 'Həftə 6', 'Həftə 7', 'Həftə 8'];
    
    // Generate simulated weekly performance data
    const trend = weeks.map((week, index) => {
      // Simulate an upward trend with some variation
      const baseValue = 75;
      const increment = Math.floor(index * 2.5);
      const variation = Math.floor(Math.random() * 5) - 2; // Random variation between -2 and +2
      
      return {
        name: week,
        value: baseValue + increment + variation
      };
    });
    
    return trend;
  } catch (error) {
    console.error('Error fetching performance trend:', error);
    throw error;
  }
};

export const getRegionSectorPerformance = async (params?: ReportParams): Promise<RegionPerformance[]> => {
  try {
    // This would be a complex query joining regions, sectors, and data entries
    // For now, we'll return simulated data
    
    const { data: regions, error: regionsError } = await supabase
      .from('regions')
      .select('id, name');
    
    if (regionsError) throw regionsError;
    
    const { data: sectors, error: sectorsError } = await supabase
      .from('sectors')
      .select('id, name, region_id');
    
    if (sectorsError) throw sectorsError;
    
    // Generate performance data for top sectors in each region
    const performanceData: RegionPerformance[] = [];
    
    regions.slice(0, 3).forEach(region => {
      const regionSectors = sectors.filter(sector => sector.region_id === region.id);
      
      if (regionSectors.length > 0) {
        // Take the first sector for simplicity
        const sector = regionSectors[0];
        
        // Generate random performance metrics
        const performance = Math.floor(Math.random() * 30) + 65; // 65-95%
        const onTimeSubmission = Math.floor(Math.random() * 25) + 70; // 70-95%
        const quality = Math.floor(Math.random() * 30) + 65; // 65-95%
        const change = Math.floor(Math.random() * 10) + (Math.random() > 0.3 ? 1 : -5); // Mostly positive changes
        
        performanceData.push({
          region: region.name,
          sector: sector.name,
          performance,
          onTimeSubmission,
          quality,
          change
        });
      }
    });
    
    return performanceData.sort((a, b) => b.performance - a.performance);
  } catch (error) {
    console.error('Error fetching region-sector performance:', error);
    throw error;
  }
};

// Comparative Trends Report
export const getCategoryTrends = async (params?: ReportParams): Promise<CompletionStatistic[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name');
    
    if (error) throw error;
    
    // For each category, calculate the trend value
    const trends = await Promise.all(
      data.slice(0, 5).map(async (category) => {
        // In a real app, you would calculate this based on historical data
        const trendValue = Math.floor(Math.random() * 35) + 55; // Random value between 55-90%
        
        return {
          name: category.name,
          value: trendValue
        };
      })
    );
    
    return trends.sort((a, b) => b.value - a.value);
  } catch (error) {
    console.error('Error fetching category trends:', error);
    throw error;
  }
};

export const getRegionComparison = async (params?: ReportParams): Promise<CompletionStatistic[]> => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .select('id, name');
    
    if (error) throw error;
    
    // For each region, calculate the comparison value
    const comparison = await Promise.all(
      data.slice(0, 5).map(async (region) => {
        // In a real app, you would calculate this based on comparative data
        const comparisonValue = Math.floor(Math.random() * 30) + 55; // Random value between 55-85%
        
        return {
          name: region.name,
          value: comparisonValue
        };
      })
    );
    
    return comparison.sort((a, b) => b.value - a.value);
  } catch (error) {
    console.error('Error fetching region comparison:', error);
    throw error;
  }
};

export const getQuarterlyTrends = async (params?: ReportParams): Promise<CompletionStatistic[]> => {
  try {
    // Generate quarterly trend data for 2022-2023
    const quarters = ['2022 Q1', '2022 Q2', '2022 Q3', '2022 Q4', '2023 Q1', '2023 Q2', '2023 Q3', '2023 Q4'];
    
    // Simulate an improving trend over time
    const trends = quarters.map((quarter, index) => {
      const baseValue = 68;
      const increment = Math.floor(index * 3);
      const variation = Math.floor(Math.random() * 3) - 1; // Small random variation
      
      return {
        name: quarter,
        value: baseValue + increment + variation
      };
    });
    
    return trends;
  } catch (error) {
    console.error('Error fetching quarterly trends:', error);
    throw error;
  }
};

export const getDistributionData = async (params?: ReportParams): Promise<CompletionStatistic[]> => {
  try {
    // Calculate the distribution of schools by completion percentage
    // In a real app, this would be based on actual school data
    
    // Distribution ranges
    const ranges = ['90-100%', '75-89%', '50-74%', '25-49%', '0-24%'];
    
    // Simulated distribution data
    const distribution = [
      { name: ranges[0], value: 15 },
      { name: ranges[1], value: 30 },
      { name: ranges[2], value: 35 },
      { name: ranges[3], value: 15 },
      { name: ranges[4], value: 5 }
    ];
    
    return distribution;
  } catch (error) {
    console.error('Error fetching distribution data:', error);
    throw error;
  }
};

export const getYearlyComparison = async (params?: ReportParams): Promise<ComparisonData[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name');
    
    if (error) throw error;
    
    // Generate year-over-year comparison data for selected categories
    const comparisonData = data.slice(0, 3).map(category => {
      const previousYear = Math.floor(Math.random() * 20) + 60; // 60-80%
      const currentYear = previousYear + Math.floor(Math.random() * 15) + (Math.random() > 0.2 ? 1 : -3); // Mostly improvements
      const change = currentYear - previousYear;
      
      return {
        category: category.name,
        previousYear,
        currentYear,
        change
      };
    });
    
    return comparisonData;
  } catch (error) {
    console.error('Error fetching yearly comparison data:', error);
    throw error;
  }
};

// Custom Reports
export const saveCustomReport = async (reportDefinition: CustomReportDefinition): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('custom_reports')
      .insert({
        name: reportDefinition.name,
        description: reportDefinition.description,
        report_type: reportDefinition.reportType,
        parameters: reportDefinition.parameters,
        visual_type: reportDefinition.visualType,
        created_by: supabase.auth.getUser() ? (await supabase.auth.getUser()).data.user?.id : null
      })
      .select('id')
      .single();
    
    if (error) throw error;
    
    return data.id;
  } catch (error) {
    console.error('Error saving custom report:', error);
    throw error;
  }
};

export const getCustomReports = async (): Promise<CustomReportDefinition[]> => {
  try {
    const { data, error } = await supabase
      .from('custom_reports')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Map the database fields to our interface
    return data.map(report => ({
      id: report.id,
      name: report.name,
      description: report.description,
      reportType: report.report_type,
      parameters: report.parameters,
      visualType: report.visual_type,
      createdBy: report.created_by,
      createdAt: report.created_at
    }));
  } catch (error) {
    console.error('Error fetching custom reports:', error);
    throw error;
  }
};

export const generateCustomReport = async (reportId: string): Promise<any> => {
  try {
    // First, get the report definition
    const { data: reportData, error: reportError } = await supabase
      .from('custom_reports')
      .select('*')
      .eq('id', reportId)
      .single();
    
    if (reportError) throw reportError;
    
    // Then generate the report based on the definition
    // This would involve complex queries based on the report parameters
    // For now, we'll return a simplistic result
    
    const result = {
      reportName: reportData.name,
      generatedAt: new Date().toISOString(),
      data: [] as any[]
    };
    
    // Generate some sample data based on the report type
    if (reportData.report_type === 'completion') {
      result.data = await getRegionCompletionStats();
    } else if (reportData.report_type === 'performance') {
      result.data = await getRegionPerformanceRanking();
    } else if (reportData.report_type === 'trends') {
      result.data = await getQuarterlyTrends();
    } else {
      // For custom reports, generate based on parameters
      // This would be more complex in a real application
      result.data = [
        { name: 'Sample Item 1', value: 75 },
        { name: 'Sample Item 2', value: 82 },
        { name: 'Sample Item 3', value: 64 }
      ];
    }
    
    return result;
  } catch (error) {
    console.error('Error generating custom report:', error);
    throw error;
  }
};

// Export Functions
export const exportReportData = async (
  data: any[], 
  fileName: string, 
  fileType: 'xlsx' | 'csv' | 'pdf'
): Promise<boolean> => {
  try {
    return await fileExport({
      data,
      fileName,
      fileType
    });
  } catch (error) {
    console.error(`Error exporting report as ${fileType}:`, error);
    throw error;
  }
};

// Helper Functions
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
