
import { supabase } from '@/integrations/supabase/client';
import { TableName } from '@/services/supabase/constants';
import { castType } from '@/utils/typeUtils';

// Simplified Metric interface to prevent deep type instantiation
export interface Metric {
  id: string;
  name?: string;
  value?: number | string;
  timestamp?: string;
  // API metrics fields
  duration_ms?: number;
  endpoint?: string;
  method?: string;
  request_params?: any;
  request_size?: number;
  response_size?: number;
  response_summary?: any;
  status_code?: number;
  user_id?: string;
}

/**
 * Service to handle metrics related operations
 */
export const metricService = {
  // Get all metrics
  async getAllMetrics(limit = 100): Promise<Metric[]> {
    try {
      const { data, error } = await supabase
        .from(TableName.API_METRICS)
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);
        
      if (error) throw error;
      
      return castType<Metric[]>(data || []);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      return [];
    }
  },
  
  // Get metrics by endpoint
  async getMetricsByEndpoint(endpoint: string, limit = 50): Promise<Metric[]> {
    try {
      const { data, error } = await supabase
        .from(TableName.API_METRICS)
        .select('*')
        .eq('endpoint', endpoint)
        .order('timestamp', { ascending: false })
        .limit(limit);
        
      if (error) throw error;
      
      return castType<Metric[]>(data || []);
    } catch (error) {
      console.error(`Error fetching metrics for endpoint ${endpoint}:`, error);
      return [];
    }
  },
  
  // Get metrics by time range
  async getMetricsByTimeRange(startTime: string, endTime: string): Promise<Metric[]> {
    try {
      const { data, error } = await supabase
        .from(TableName.API_METRICS)
        .select('*')
        .gte('timestamp', startTime)
        .lte('timestamp', endTime)
        .order('timestamp', { ascending: false });
        
      if (error) throw error;
      
      return castType<Metric[]>(data || []);
    } catch (error) {
      console.error(`Error fetching metrics in time range ${startTime} to ${endTime}:`, error);
      return [];
    }
  },
  
  // Create a new metric
  async createMetric(metricData: Partial<Metric>): Promise<Metric | null> {
    try {
      const { data, error } = await supabase
        .from(TableName.API_METRICS)
        .insert([metricData])
        .select()
        .single();
        
      if (error) throw error;
      
      return castType<Metric>(data);
    } catch (error) {
      console.error('Error creating metric:', error);
      return null;
    }
  },
  
  // Get performance metrics
  async getPerformanceMetrics(): Promise<any> {
    try {
      // API response count
      const { count: apiCount, error: apiError } = await supabase
        .from(TableName.API_METRICS)
        .select('*', { count: 'exact', head: true });
      
      // Data entries count  
      const { count: dataCount, error: dataError } = await supabase
        .from(TableName.DATA)
        .select('*', { count: 'exact', head: true });
      
      // Average API response time
      const { data: avgTimeData, error: avgTimeError } = await supabase
        .from(TableName.API_METRICS)
        .select('duration_ms')
        .order('timestamp', { ascending: false })
        .limit(100);
      
      if (apiError || dataError || avgTimeError) {
        console.error('Error fetching performance metrics', apiError || dataError || avgTimeError);
      }
      
      // Calculate average response time if data is available
      let avgResponseTime = 0;
      if (avgTimeData && avgTimeData.length > 0) {
        const sum = avgTimeData.reduce((acc, item) => acc + (item.duration_ms || 0), 0);
        avgResponseTime = sum / avgTimeData.length;
      }
      
      return {
        apiRequestCount: apiCount || 0,
        dataEntryCount: dataCount || 0,
        averageResponseTime: avgResponseTime,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error calculating performance metrics:', error);
      return {
        apiRequestCount: 0,
        dataEntryCount: 0,
        averageResponseTime: 0,
        timestamp: new Date().toISOString(),
        error: error
      };
    }
  }
};

export default metricService;
