
import { supabase } from '@/integrations/supabase/client';

export interface ReportFilter {
  regionId?: string;
  sectorId?: string;
  schoolId?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  groupBy?: 'region' | 'sector' | 'school' | 'category';
}

const reportService = {
  getDashboardData: async () => {
    // Get summary statistics for dashboard
    const { data: stats, error: statsError } = await supabase.rpc('get_dashboard_statistics');
    
    if (statsError) throw statsError;
    
    // Get recent activity
    const { data: activities, error: activitiesError } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (activitiesError) throw activitiesError;
    
    return {
      stats,
      activities
    };
  },
  
  getCompletionStats: async (filters: ReportFilter = {}) => {
    // Build filters for RPC call
    const filterParams: Record<string, any> = {};
    
    if (filters.regionId) filterParams.p_region_id = filters.regionId;
    if (filters.sectorId) filterParams.p_sector_id = filters.sectorId;
    if (filters.schoolId) filterParams.p_school_id = filters.schoolId;
    if (filters.categoryId) filterParams.p_category_id = filters.categoryId;
    if (filters.startDate) filterParams.p_start_date = filters.startDate;
    if (filters.endDate) filterParams.p_end_date = filters.endDate;
    
    // Call Supabase function to get completion statistics
    const { data, error } = await supabase.rpc(
      'get_completion_statistics', 
      filterParams
    );
    
    if (error) throw error;
    return data;
  },
  
  getComparisonData: async (filters: ReportFilter = {}) => {
    // Build filters for RPC call
    const filterParams: Record<string, any> = {};
    
    if (filters.regionId) filterParams.p_region_id = filters.regionId;
    if (filters.sectorId) filterParams.p_sector_id = filters.sectorId;
    if (filters.schoolId) filterParams.p_school_id = filters.schoolId;
    if (filters.categoryId) filterParams.p_category_id = filters.categoryId;
    if (filters.startDate) filterParams.p_start_date = filters.startDate;
    if (filters.endDate) filterParams.p_end_date = filters.endDate;
    if (filters.groupBy) filterParams.p_group_by = filters.groupBy;
    
    // Call Supabase function to get comparison data
    const { data, error } = await supabase.rpc(
      'get_comparison_data', 
      filterParams
    );
    
    if (error) throw error;
    return data;
  },
  
  exportReport: async (reportType: string, filters: ReportFilter = {}) => {
    // This would typically generate a report file
    // Since file generation is complex, we'll use an RPC function
    const filterParams: Record<string, any> = {
      p_report_type: reportType,
      ...filters
    };
    
    // Call Supabase function to generate report
    const { data, error } = await supabase.rpc(
      'generate_report_file', 
      filterParams
    );
    
    if (error) throw error;
    
    // In a real implementation, this might return a file URL or trigger a download
    return data;
  }
};

export default reportService;
