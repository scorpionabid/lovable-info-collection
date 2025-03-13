
import { CompletionStatistic, ComparisonData } from './types';

// Helper function to generate category trend data
export const getCategoryTrends = async (params?: any): Promise<any[]> => {
  const categories = ['Ümumi məlumatlar', 'İnfrastruktur', 'Akademik göstəricilər', 'Müəllim heyəti', 'Şagird nailiyyətləri'];
  
  return categories.map(category => ({
    id: category,
    name: category,
    value: Math.floor(Math.random() * 30) + 60 // 60-90%
  }));
};

// Helper function to generate region comparison data
export const getRegionComparison = async (params?: any): Promise<any[]> => {
  const regions = ['Bakı', 'Gəncə', 'Sumqayıt', 'Şirvan', 'Mingəçevir', 'Naxçıvan'];
  
  return regions.map(region => ({
    id: region,
    name: region,
    value: Math.floor(Math.random() * 30) + 50 // 50-80%
  }));
};

// Helper function to generate quarterly trends data
export const getQuarterlyTrends = async (params?: any): Promise<any[]> => {
  const quarters = ['2022 Q1', '2022 Q2', '2022 Q3', '2022 Q4', '2023 Q1', '2023 Q2', '2023 Q3', '2023 Q4'];
  
  return quarters.map(quarter => ({
    id: quarter,
    name: quarter,
    value: Math.floor(Math.random() * 35) + 55 // 55-90%
  }));
};

// Helper function to generate distribution data
export const getDistributionData = async (params?: any): Promise<any[]> => {
  return [
    { id: '90-100%', name: '90-100%', value: 15 },
    { id: '80-90%', name: '80-90%', value: 25 },
    { id: '70-80%', name: '70-80%', value: 30 },
    { id: '60-70%', name: '60-70%', value: 18 },
    { id: '< 60%', name: '< 60%', value: 12 }
  ];
};

// Helper function to generate yearly comparison data
export const getYearlyComparison = async (params?: any): Promise<any[]> => {
  const categories = [
    { category: 'Ümumi məlumatlar', previousYear: 72, currentYear: 78, change: 6 },
    { category: 'İnfrastruktur', previousYear: 65, currentYear: 74, change: 9 },
    { category: 'Akademik göstəricilər', previousYear: 85, currentYear: 83, change: -2 },
    { category: 'Müəllim heyəti', previousYear: 79, currentYear: 86, change: 7 },
    { category: 'Şagird nailiyyətləri', previousYear: 81, currentYear: 87, change: 6 }
  ];
  
  return categories;
};
