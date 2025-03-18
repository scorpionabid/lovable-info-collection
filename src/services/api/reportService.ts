import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { getSimplifiedTableQuery } from './utils/typeHelpers';
import { serviceLogger } from '@/utils/serviceLogger';

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
    // Since we can't use RPC, let's get basic statistics directly
    
    // Get total counts of key entities
    const [regionsResult, sectorsResult, schoolsResult, categoriesResult, activitiesResult] = await Promise.all([
      supabase.from('regions').select('id', { count: 'exact' }),
      supabase.from('sectors').select('id', { count: 'exact' }),
      supabase.from('schools').select('id', { count: 'exact' }),
      supabase.from('categories').select('id', { count: 'exact' }),
      supabase.from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)
    ]);
    
    // Handle potential errors
    if (regionsResult.error) throw regionsResult.error;
    if (sectorsResult.error) throw sectorsResult.error;
    if (schoolsResult.error) throw schoolsResult.error;
    if (categoriesResult.error) throw categoriesResult.error;
    if (activitiesResult.error) throw activitiesResult.error;
    
    // Create a stats object similar to what the RPC would have returned
    const stats = {
      regions_count: regionsResult.count || 0,
      sectors_count: sectorsResult.count || 0,
      schools_count: schoolsResult.count || 0,
      categories_count: categoriesResult.count || 0,
      completion_rate: 0 // Calculating this would require additional queries
    };
    
    return {
      stats,
      activities: activitiesResult.data
    };
  },
  
  getCompletionStats: async (filters: ReportFilter = {}) => {
    // Build query to get completion statistics based on filters
    let query = supabase.from('data')
      .select('category_id, school_id, status, count(*)', { count: 'exact' });
    
    // Apply filters
    if (filters.regionId) {
      const schoolsInRegion = await supabase
        .from('schools')
        .select('id')
        .eq('region_id', filters.regionId);
      
      if (schoolsInRegion.error) throw schoolsInRegion.error;
      const schoolIds = schoolsInRegion.data.map(s => s.id);
      
      if (schoolIds.length > 0) {
        query = query.in('school_id', schoolIds);
      }
    }
    
    if (filters.sectorId) {
      const schoolsInSector = await supabase
        .from('schools')
        .select('id')
        .eq('sector_id', filters.sectorId);
      
      if (schoolsInSector.error) throw schoolsInSector.error;
      const schoolIds = schoolsInSector.data.map(s => s.id);
      
      if (schoolIds.length > 0) {
        query = query.in('school_id', schoolIds);
      }
    }
    
    if (filters.schoolId) {
      query = query.eq('school_id', filters.schoolId);
    }
    
    if (filters.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }
    
    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate);
    }
    
    if (filters.endDate) {
      query = query.lte('created_at', filters.endDate);
    }
    
    // Execute the query
    const { data, error, count } = await query;
    
    if (error) throw error;
    
    // Process the results to simulate grouping by status
    const statusGroups: Record<string, any[]> = {};
    
    // Make sure data exists and is an array before processing
    if (data && Array.isArray(data)) {
      data.forEach((item) => {
        // Skip if item is null or undefined
        if (item === null || item === undefined) return;
        
        // Type guard to ensure item is an object with a status property
        if (typeof item === 'object' && item !== null && 'status' in item) {
          // Now TypeScript knows item is a non-null object with a status property
          const status = String(item.status) || 'unknown';
          
          if (!statusGroups[status]) {
            statusGroups[status] = [];
          }
          // Since we've verified item is not null, we can safely push it
          statusGroups[status].push(item);
        } else {
          // If item doesn't have a status property, categorize as unknown
          if (!statusGroups['unknown']) {
            statusGroups['unknown'] = [];
          }
          // Ensure item is not null before pushing
          if (item !== null) {
            statusGroups['unknown'].push(item);
          }
        }
      });
    }
    
    // Transform the data to match the expected format
    const result = {
      completion_by_status: Object.entries(statusGroups).map(([status, items]) => ({
        status,
        count: items.length
      })),
      total_entries: count || 0
    };
    
    return result;
  },
  
  getComparisonData: async (filters: ReportFilter = {}) => {
    // For comparison data, we need to handle different tables based on groupBy
    let data: any[] = [];
    let error = null;
    
    // Handle each group by case separately to satisfy TypeScript
    if (filters.groupBy === 'region') {
      const result = await supabase
        .from('schools')
        .select('id, name, region_id');
      error = result.error;
      data = result.data || [];
    } else if (filters.groupBy === 'sector') {
      const result = await supabase
        .from('schools')
        .select('id, name, sector_id');
      error = result.error;
      data = result.data || [];
    } else if (filters.groupBy === 'category') {
      const result = await supabase
        .from('categories')
        .select('id, name');
      error = result.error;
      data = result.data || [];
    } else {
      // Default case - fetch data entries
      const result = await supabase
        .from('data')
        .select('id, category_id, school_id, status');
      error = result.error;
      data = result.data || [];
    }
    
    if (error) throw error;
    
    return data;
  },
  
  exportReport: async (reportType: string, filters: ReportFilter = {}) => {
    // For export functionality, we need to gather the appropriate data
    // Let's implement a simple version
    
    let query;
    
    if (reportType === 'completion') {
      query = supabase.from('data')
        .select(`
          id,
          category_id,
          school_id,
          status,
          created_at,
          updated_at,
          schools(name),
          categories(name)
        `);
    } else if (reportType === 'comparison') {
      query = supabase.from('data')
        .select(`
          id,
          category_id,
          school_id,
          status,
          data,
          schools(name, region_id, sector_id),
          categories(name)
        `);
    } else {
      throw new Error('Unsupported report type');
    }
    
    // Apply filters
    if (filters.regionId) {
      const schoolsInRegion = await supabase
        .from('schools')
        .select('id')
        .eq('region_id', filters.regionId);
      
      if (schoolsInRegion.error) throw schoolsInRegion.error;
      const schoolIds = schoolsInRegion.data.map(s => s.id);
      
      if (schoolIds.length > 0) {
        query = query.in('school_id', schoolIds);
      }
    }
    
    if (filters.sectorId) {
      const schoolsInSector = await supabase
        .from('schools')
        .select('id')
        .eq('sector_id', filters.sectorId);
      
      if (schoolsInSector.error) throw schoolsInSector.error;
      const schoolIds = schoolsInSector.data.map(s => s.id);
      
      if (schoolIds.length > 0) {
        query = query.in('school_id', schoolIds);
      }
    }
    
    if (filters.schoolId) {
      query = query.eq('school_id', filters.schoolId);
    }
    
    if (filters.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Return the data for export processing
    return data || [];
  }
};

export default reportService;

