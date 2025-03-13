
import { PerformanceMetric, RegionPerformance, CompletionStatistic } from './types';

// Helper function to generate random performance metrics
export const getPerformanceMetrics = async (params?: any): Promise<PerformanceMetric[]> => {
  return [
    {
      id: '1',
      name: 'Ümumi doldurulma faizi',
      value: 78,
      change: 5,
      trend: 'up'
    },
    {
      id: '2',
      name: 'Vaxtında təqdimat faizi',
      value: 82,
      change: -3,
      trend: 'down'
    },
    {
      id: '3',
      name: 'Məlumat keyfiyyəti',
      value: 86,
      change: 2,
      trend: 'up'
    }
  ];
};

// Helper functions for Performance Analysis Report
export const getRegionPerformanceData = async (params?: any): Promise<any[]> => {
  const regions = ['Bakı', 'Gəncə', 'Sumqayıt', 'Şirvan', 'Mingəçevir', 'Naxçıvan'];
  
  return regions.map(region => ({
    id: region,
    name: region,
    value: Math.floor(Math.random() * 40) + 60 // 60-100%
  }));
};

export const getPerformanceTrendData = async (params?: any): Promise<any[]> => {
  const weeks = ['1-ci həftə', '2-ci həftə', '3-cü həftə', '4-cü həftə', 
                '5-ci həftə', '6-cı həftə', '7-ci həftə', '8-ci həftə'];
  
  return weeks.map(week => ({
    id: week,
    name: week,
    value: Math.floor(Math.random() * 30) + 60 // 60-90%
  }));
};

export const getRegionSectorData = async (params?: any): Promise<any[]> => {
  const data = [
    { region: 'Bakı', sector: 'Mərkəz', performance: 85, onTimeSubmission: 92, quality: 88, change: 3 },
    { region: 'Bakı', sector: 'Şimal', performance: 78, onTimeSubmission: 75, quality: 82, change: -2 },
    { region: 'Gəncə', sector: 'Mərkəz', performance: 82, onTimeSubmission: 79, quality: 85, change: 5 },
    { region: 'Sumqayıt', sector: 'Qərb', performance: 73, onTimeSubmission: 68, quality: 76, change: -4 },
    { region: 'Naxçıvan', sector: 'Mərkəz', performance: 91, onTimeSubmission: 95, quality: 89, change: 7 }
  ];
  
  return data;
};
