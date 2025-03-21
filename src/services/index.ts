
/**
 * Re-export all services for easier imports
 */

// Base services - explicitly name exports to avoid ambiguity
export * from './userService';
export * from './regionService';
export * from './sectorService';
export * from './schoolService';
export * from './authService';
export * from './notificationService';
export * from './exportService';
export * from './metricService';

// Import constants from supabase config
import { 
  SUPABASE_URL, 
  SUPABASE_ANON_KEY, 
  CACHE_CONFIG 
} from '@/lib/supabase/config';

// Export Supabase client
export { supabase } from '@/supabase/client';

// Re-export config values with different names to avoid conflicts
export {
  SUPABASE_URL as SUPABASE_BASE_URL,
  SUPABASE_ANON_KEY as SUPABASE_API_KEY,
  CACHE_CONFIG as CACHE_SETTINGS
};
