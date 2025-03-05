
import { supabase } from '../supabaseClient';
import { CompletionStatistic, ComparisonData, ReportParams } from './types';

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
