
// Centralized Supabase client with improved configuration
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { logger } from '@/utils/logger';

// Constant values
const SUPABASE_URL = "https://wxkaasjwpavlwrpvsuia.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4a2Fhc2p3cGF2bHdycHZzdWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzODA3NzAsImV4cCI6MjA1NTk1Njc3MH0.Sy0ktssGHAMNtU4kCrEKuFNf8Yf5R280uqwpsMcZpuM";
const REQUEST_TIMEOUT_MS = 15000; // 15 seconds

// Create the Supabase client with optimized options
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    fetch: (...args) => {
      // Add fetch timeout to prevent hanging requests
      const fetchWithTimeout = async (resource: RequestInfo, options: RequestInit = {}) => {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
        const response = await fetch(resource, {
          ...options,
          signal: controller.signal
        });
        clearTimeout(id);
        return response;
      };
      return fetchWithTimeout(args[0] as RequestInfo, args[1] as RequestInit);
    },
    headers: { 'x-application-name': 'infoLine' }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 1 // Reduce realtime events limit
    }
  }
});

// Monitoring middleware for debugging Supabase operations
supabase.auth.onAuthStateChange((event, session) => {
  logger.info('Supabase auth event:', {event, isAuthenticated: !!session});
});

// Connection check with proper timeout management
export const checkConnection = async (): Promise<boolean> => {
  try {
    const start = Date.now();
    
    // Simple query to check connection
    const { data, error } = await supabase
      .from('regions')
      .select('id, name')
      .limit(1)
      .maybeSingle();
    
    const duration = Date.now() - start;
    
    if (error) {
      logger.error('Supabase connection check failed', { error, duration });
      return false;
    }
    
    logger.info('Supabase connection check successful', { duration, hasData: !!data });
    return true;
  } catch (err) {
    logger.error('Supabase connection exception', { error: err });
    return false;
  }
};

// Simplified retry logic with better error handling
export const withRetry = async <T>(
  queryFn: () => Promise<T>, 
  maxRetries = 2, 
  initialRetryDelay = 1000
): Promise<T> => {
  let retries = 0;
  let lastError: unknown;
  
  while (retries <= maxRetries) {
    try {
      if (retries > 0) {
        logger.info(`Retry attempt ${retries}/${maxRetries}`);
      }
      
      return await queryFn();
    } catch (error) {
      lastError = error;
      
      // If this was the last retry, don't wait
      if (retries === maxRetries) {
        break;
      }
      
      retries++;
      
      // Calculate exponential backoff with jitter
      const delay = initialRetryDelay * Math.pow(1.5, retries - 1) * (0.9 + Math.random() * 0.2);
      
      logger.warn(`Query failed, retrying in ${Math.round(delay)}ms`, {
        error,
        attempt: retries,
        maxRetries
      });
      
      // Wait before next retry
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  logger.error(`Query failed after ${maxRetries} retry attempts`, lastError);
  throw lastError;
};

// Helper functions for query building
export const buildPaginatedQuery = (query: any, pagination: { page: number, pageSize: number }) => {
  const { page, pageSize } = pagination;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  return query.range(from, to);
};

export const buildSortedQuery = (query: any, sort: { column: string, direction: 'asc' | 'desc' }) => {
  const { column, direction } = sort;
  return query.order(column, { ascending: direction === 'asc' });
};

export const buildFilteredQuery = (query: any, filters: Record<string, any>, filterMap?: Record<string, (q: any, value: any) => any>) => {
  // Skip if no filters provided
  if (!filters || Object.keys(filters).length === 0) {
    return query;
  }

  let filteredQuery = query;
  
  // Apply each filter
  Object.entries(filters).forEach(([key, value]) => {
    // Skip null/undefined/empty values
    if (value === null || value === undefined || value === '') {
      return;
    }
    
    // Use custom filter function if available
    if (filterMap && filterMap[key]) {
      filteredQuery = filterMap[key](filteredQuery, value);
      return;
    }
    
    // Default filter logic (customize as needed)
    if (typeof value === 'string' && value.includes('%')) {
      filteredQuery = filteredQuery.ilike(key, value);
    } else {
      filteredQuery = filteredQuery.eq(key, value);
    }
  });
  
  return filteredQuery;
};
