
import { supabase } from './supabaseClient';

// Custom types for report data
type CompletionStatistics = {
  region_id?: string;
  sector_id?: string;
  category_id?: string;
  total_schools: number;
  submitted_count: number;
  approved_count: number;
  rejected_count: number;
  not_submitted_count: number;
  completion_rate: number;
};

type PerformanceAnalysis = {
  entity_id: string;
  entity_name: string;
  entity_type: 'region' | 'sector' | 'school';
  metrics: {
    [key: string]: number;
  };
  rank: number;
  previous_rank?: number;
  change?: number;
};

const reportService = {
  getDashboardStats: async (filters?: { regionId?: string; sectorId?: string }) => {
    // In a real implementation, these would be combined into a single RPC call or transaction
    // For this example, we'll make separate queries
    
    // Get total counts
    let schoolQuery = supabase.from('schools').select('count');
    let userQuery = supabase.from('users').select('count');
    let categoryQuery = supabase.from('categories').select('count').eq('status', 'active');
    
    if (filters?.regionId) {
      schoolQuery = schoolQuery.eq('region_id', filters.regionId);
      userQuery = userQuery.eq('region_id', filters.regionId);
    }
    
    if (filters?.sectorId) {
      schoolQuery = schoolQuery.eq('sector_id', filters.sectorId);
      userQuery = userQuery.eq('sector_id', filters.sectorId);
    }
    
    const [
      { count: schoolCount, error: schoolError },
      { count: userCount, error: userError },
      { count: categoryCount, error: categoryError }
    ] = await Promise.all([
      schoolQuery.single(),
      userQuery.single(),
      categoryQuery.single()
    ]);
    
    if (schoolError || userError || categoryError) {
      throw new Error('Error fetching dashboard stats');
    }
    
    // Get completion statistics
    const { data: completionData, error: completionError } = await supabase
      .rpc('get_completion_statistics', { 
        p_region_id: filters?.regionId || null,
        p_sector_id: filters?.sectorId || null
      });
    
    if (completionError) throw completionError;
    
    // Get recent submissions
    const { data: recentSubmissions, error: submissionsError } = await supabase
      .from('data_entries')
      .select(`
        *,
        schools(name),
        categories(name),
        users(first_name, last_name)
      `)
      .order('submitted_at', { ascending: false })
      .limit(5);
    
    if (submissionsError) throw submissionsError;
    
    return {
      counts: {
        schools: schoolCount,
        users: userCount,
        categories: categoryCount
      },
      completionStats: completionData,
      recentSubmissions
    };
  },
  
  getCompletionStatistics: async (filters?: { regionId?: string; sectorId?: string; categoryId?: string }) => {
    const { data, error } = await supabase
      .rpc('get_completion_statistics', { 
        p_region_id: filters?.regionId || null,
        p_sector_id: filters?.sectorId || null,
        p_category_id: filters?.categoryId || null
      });
    
    if (error) throw error;
    return data as CompletionStatistics[];
  },
  
  getPerformanceAnalysis: async (filters?: { 
    entityType: 'region' | 'sector' | 'school'; 
    categoryId?: string;
    timeRange?: 'month' | 'quarter' | 'year';
  }) => {
    const { data, error } = await supabase
      .rpc('get_performance_analysis', { 
        p_entity_type: filters?.entityType || 'region',
        p_category_id: filters?.categoryId || null,
        p_time_range: filters?.timeRange || 'month'
      });
    
    if (error) throw error;
    return data as PerformanceAnalysis[];
  },
  
  getComparisonData: async (params: {
    entityIds: string[];
    entityType: 'region' | 'sector' | 'school';
    metrics: string[];
    timeRange?: 'month' | 'quarter' | 'year';
  }) => {
    const { data, error } = await supabase
      .rpc('get_comparison_data', {
        p_entity_ids: params.entityIds,
        p_entity_type: params.entityType,
        p_metrics: params.metrics,
        p_time_range: params.timeRange || 'month'
      });
    
    if (error) throw error;
    return data;
  },
  
  generateReport: async (params: {
    reportType: 'completion' | 'performance' | 'comparison';
    filters: Record<string, any>;
    format: 'json' | 'excel' | 'pdf';
  }) => {
    // In a real implementation, this would likely call an edge function
    // that would generate the report in the requested format
    
    // For this example, we'll just return a URL
    return {
      url: `https://example.com/reports/${params.reportType}.${params.format}`
    };
  }
};

export default reportService;
