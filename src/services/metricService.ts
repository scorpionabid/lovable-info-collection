
import { toast } from 'sonner';
import { supabase } from '@/supabase/client'; // Updated import path

// Interface for performance metric
export interface PerformanceMetric {
  page_path: string;
  load_time_ms: number;
  ttfb_ms?: number;
  lcp_ms?: number;
  fid_ms?: number;
  cls_score?: number;
  device_info?: {
    userAgent: string;
    deviceType: string;
    screenSize: string;
  };
  network_info?: {
    effectiveType: string;
    downlink: number;
    rtt: number;
  };
}

// Record performance metrics
export const recordPerformanceMetric = async (metric: PerformanceMetric) => {
  try {
    const { error } = await supabase.from('performance_metrics').insert([metric]);
    
    if (error) {
      console.error('Error recording performance metric:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to record performance metric:', error);
    return false;
  }
};

// Interface for API metric
export interface ApiMetric {
  endpoint: string;
  method: string;
  duration_ms: number;
  status_code?: number;
  request_params?: any;
  response_summary?: any;
  request_size?: number;
  response_size?: number;
}

// Record API call metrics
export const recordApiMetric = async (metric: ApiMetric) => {
  try {
    const { error } = await supabase.from('api_metrics').insert([metric]);
    
    if (error) {
      console.error('Error recording API metric:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to record API metric:', error);
    return false;
  }
};

// Log a client-side error
export const logError = async (errorData: {
  error_message: string;
  error_stack?: string;
  component?: string;
  page_path?: string;
  error_context?: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
}) => {
  try {
    const { error } = await supabase.from('error_logs').insert([{
      error_message: errorData.error_message,
      error_stack: errorData.error_stack,
      component: errorData.component,
      page_path: errorData.page_path || window.location.pathname,
      error_context: errorData.error_context,
      severity: errorData.severity,
      browser_info: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform
      }
    }]);
    
    if (error) {
      console.error('Error logging client error:', error);
      return false;
    }
    
    // For critical errors, show a toast notification
    if (errorData.severity === 'critical') {
      toast.error('Kritik bir xəta baş verdi və texniki komandaya bildirildi');
    }
    
    return true;
  } catch (error) {
    console.error('Failed to log error:', error);
    return false;
  }
};

// Get error logs (for admin dashboard)
export const getErrorLogs = async (filters?: {
  severity?: string;
  dateFrom?: string;
  dateTo?: string;
  component?: string;
  limit?: number;
}) => {
  try {
    let query = supabase
      .from('error_logs')
      .select('*')
      .order('timestamp', { ascending: false });
    
    if (filters) {
      if (filters.severity) {
        query = query.eq('severity', filters.severity);
      }
      
      if (filters.component) {
        query = query.eq('component', filters.component);
      }
      
      if (filters.dateFrom) {
        query = query.gte('timestamp', filters.dateFrom);
      }
      
      if (filters.dateTo) {
        query = query.lte('timestamp', filters.dateTo);
      }
      
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching error logs:', error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Failed to fetch error logs:', error);
    return [];
  }
};

// Record a monitoring metric
export const recordMonitoringMetric = async (data: {
  metric_name: string;
  metric_value: number;
  metric_type: 'counter' | 'gauge' | 'histogram';
  component?: string;
  tags?: Record<string, string | number | boolean>;
}) => {
  try {
    const { error } = await supabase.from('monitoring_metrics').insert([data]);
    
    if (error) {
      console.error('Error recording monitoring metric:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to record monitoring metric:', error);
    return false;
  }
};
