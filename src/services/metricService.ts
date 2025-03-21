/**
 * Metrika və monitoring funksiyaları
 */
import { supabase } from './supabaseClient';
import { v4 as uuidv4 } from 'uuid';

// TypeScript Interface for Metrics
export interface Metric {
  id?: string;
  endpoint: string;
  method: string;
  duration_ms: number;
  status_code?: number;
  request_params?: any;
  response_summary?: any;
  request_size?: number;
  response_size?: number;
  user_id?: string;
  timestamp?: string;
}

// Batch metrics queue
let metricQueue: Metric[] = [];
const MAX_QUEUE_SIZE = 20;
let flushTimeoutId: NodeJS.Timeout | null = null;

// Add a new metric to the queue
export function addMetric(metric: Metric): void {
  // Add timestamp if not provided
  if (!metric.timestamp) {
    metric.timestamp = new Date().toISOString();
  }
  
  // Add UUID if not provided
  if (!metric.id) {
    metric.id = uuidv4();
  }
  
  metricQueue.push(metric);
  
  // Schedule a flush if not already scheduled
  if (!flushTimeoutId) {
    flushTimeoutId = setTimeout(flushMetrics, 5000); // Flush every 5 seconds
  }
  
  // Flush immediately if queue is full
  if (metricQueue.length >= MAX_QUEUE_SIZE) {
    if (flushTimeoutId) {
      clearTimeout(flushTimeoutId);
      flushTimeoutId = null;
    }
    flushMetrics();
  }
}

// Flush metrics to database
export async function flushMetrics(): Promise<void> {
  if (metricQueue.length === 0) {
    return;
  }
  
  const metricsToFlush = [...metricQueue];
  metricQueue = [];
  
  if (flushTimeoutId) {
    clearTimeout(flushTimeoutId);
    flushTimeoutId = null;
  }
  
  try {
    // Make sure all metrics have the required fields
    const validMetrics = metricsToFlush.filter(metric => 
      metric.endpoint && 
      metric.method && 
      typeof metric.duration_ms === 'number'
    );
    
    if (validMetrics.length === 0) {
      return;
    }
    
    // Insert each metric as an individual record
    for (const metric of validMetrics) {
      const { error } = await supabase
        .from('api_metrics')
        .insert(metric);
        
      if (error) {
        console.error('Error inserting metric:', error);
      }
    }
  } catch (error) {
    console.error('Failed to flush metrics:', error);
  }
}

// Measure API call performance
export function measureApiCall<T>(
  endpoint: string,
  method: string,
  fn: () => Promise<T>,
  params?: any
): Promise<T> {
  const start = performance.now();
  
  return fn()
    .then(result => {
      const duration = performance.now() - start;
      
      // Create metric object
      const metric: Metric = {
        endpoint,
        method,
        duration_ms: Math.round(duration),
        status_code: 200,
        request_params: params,
        timestamp: new Date().toISOString()
      };
      
      // Add response summary if available
      if (result && typeof result === 'object') {
        // Only include a subset of the response to keep the size reasonable
        metric.response_summary = JSON.stringify(result).substring(0, 200);
      }
      
      addMetric(metric);
      return result;
    })
    .catch(error => {
      const duration = performance.now() - start;
      
      // Create error metric
      const metric: Metric = {
        endpoint,
        method,
        duration_ms: Math.round(duration),
        status_code: error.status || 500,
        request_params: params,
        timestamp: new Date().toISOString()
      };
      
      // Add error summary
      if (error) {
        metric.response_summary = {
          message: error.message || 'Unknown error',
          code: error.code || 'UNKNOWN'
        };
      }
      
      addMetric(metric);
      throw error;
    });
}

// Get performance metrics for analysis
export async function getPerformanceMetrics(
  days: number = 7
): Promise<{ endpoints: any[]; averages: any }> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  try {
    const { data, error } = await supabase
      .from('api_metrics')
      .select('endpoint, method, duration_ms, status_code, timestamp')
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: false });
      
    if (error) throw error;
    
    // Calculate metrics by endpoint
    const endpoints: Record<string, any> = {};
    let totalDuration = 0;
    let totalCalls = 0;
    
    data.forEach(metric => {
      const key = `${metric.method} ${metric.endpoint}`;
      
      if (!endpoints[key]) {
        endpoints[key] = {
          calls: 0,
          totalDuration: 0,
          avgDuration: 0,
          min: Infinity,
          max: 0,
          errorRate: 0,
          errors: 0,
          endpoint: metric.endpoint,
          method: metric.method
        };
      }
      
      endpoints[key].calls++;
      endpoints[key].totalDuration += metric.duration_ms;
      endpoints[key].min = Math.min(endpoints[key].min, metric.duration_ms);
      endpoints[key].max = Math.max(endpoints[key].max, metric.duration_ms);
      
      if (metric.status_code >= 400) {
        endpoints[key].errors++;
      }
      
      totalDuration += metric.duration_ms;
      totalCalls++;
    });
    
    // Calculate averages and error rates
    Object.keys(endpoints).forEach(key => {
      const endpoint = endpoints[key];
      endpoint.avgDuration = Math.round(endpoint.totalDuration / endpoint.calls);
      endpoint.errorRate = (endpoint.errors / endpoint.calls) * 100;
    });
    
    // Overall system averages
    const averages = {
      totalCalls,
      avgDuration: totalCalls > 0 ? Math.round(totalDuration / totalCalls) : 0,
      totalEndpoints: Object.keys(endpoints).length
    };
    
    return {
      endpoints: Object.values(endpoints),
      averages
    };
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    throw error;
  }
}

// Default export for service
const metricService = {
  addMetric,
  flushMetrics,
  measureApiCall,
  getPerformanceMetrics
};

export { metricService };
