
import { supabase } from '../supabaseClient';
import { PerformanceMetric, RegionPerformance, CompletionStatistic, ReportParams } from './types';

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
