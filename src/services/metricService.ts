
import { supabase } from '@/lib/supabase';

interface Metric {
  duration_ms?: number;
  endpoint?: string;
  method?: string;
  request_params?: any;
  response_summary?: any;
  status_code?: number;
  request_size?: number;
  response_size?: number;
  user_id?: string;
}

const BATCH_SIZE = 10;
let metricsQueue: Metric[] = [];
let flushTimeout: NodeJS.Timeout | null = null;

// Flush metrics to the database
const flushMetrics = async () => {
  if (metricsQueue.length === 0) return;

  const metrics = [...metricsQueue];
  metricsQueue = [];
  
  try {
    // Make sure all required fields are present in each metric
    const validMetrics = metrics.filter(metric => 
      typeof metric.duration_ms === 'number' && 
      typeof metric.endpoint === 'string' && 
      typeof metric.method === 'string'
    );
    
    if (validMetrics.length === 0) return;
    
    // Insert metrics
    const { error } = await supabase
      .from('api_metrics')
      .insert(validMetrics);
      
    if (error) {
      console.error('Error logging metrics:', error);
    }
  } catch (error) {
    console.error('Failed to flush metrics:', error);
    // Put metrics back in queue
    metricsQueue = [...metricsQueue, ...metrics];
  }
};

// Schedule metrics flush
const scheduleFlush = () => {
  if (flushTimeout) clearTimeout(flushTimeout);
  flushTimeout = setTimeout(flushMetrics, 5000); // Flush every 5 seconds
};

// Add a metric to the queue
export const logMetric = (metric: Metric) => {
  metricsQueue.push({
    ...metric,
    timestamp: new Date().toISOString()
  });
  
  if (metricsQueue.length >= BATCH_SIZE) {
    flushMetrics();
  } else {
    scheduleFlush();
  }
};

// Log an API request
export const logApiRequest = async (
  endpoint: string,
  method: string,
  startTime: number,
  response: Response,
  requestParams?: any,
  requestSize?: number
) => {
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  let responseData;
  let responseSize;
  
  try {
    // Clone the response to avoid consuming it
    const clonedResponse = response.clone();
    const text = await clonedResponse.text();
    responseSize = text.length;
    
    try {
      responseData = JSON.parse(text);
    } catch (e) {
      responseData = { text: text.substring(0, 100) + (text.length > 100 ? '...' : '') };
    }
  } catch (error) {
    console.warn('Could not extract response data for metrics', error);
    responseData = { error: 'Could not extract response data' };
  }
  
  logMetric({
    endpoint,
    method,
    duration_ms: duration,
    status_code: response.status,
    request_params: requestParams,
    response_summary: responseData,
    request_size: requestSize,
    response_size: responseSize
  });
};

// Bulk log metrics
export const bulkLogMetrics = async (metrics: Partial<Metric>[]) => {
  if (!metrics.length) return;
  
  try {
    // Process each metric individually to ensure it has required fields
    metrics.forEach(metric => {
      // Add timestamp if not present
      if (!metric.timestamp) {
        metric.timestamp = new Date().toISOString();
      }
      
      // Only add valid metrics to the queue
      if (metric.duration_ms && metric.endpoint && metric.method) {
        metricsQueue.push(metric as Metric);
      }
    });
    
    if (metricsQueue.length >= BATCH_SIZE) {
      flushMetrics();
    } else {
      scheduleFlush();
    }
  } catch (error) {
    console.error('Error bulk logging metrics:', error);
  }
};

// Flush metrics on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (metricsQueue.length > 0) {
      flushMetrics();
    }
  });
}
