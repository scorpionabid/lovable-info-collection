
/**
 * Re-export all services for easier imports
 */

// Base services
export * from './userService';
export * from './regionService';
export * from './sectorService';
export * from './schoolService';
export * from './authService';
export * from './notificationService';
export * from './exportService';
export * from './metricService';

// Supabase client from new location - avoid ambiguity by using specific imports
export { 
  supabase, 
  // No more re-exporting these to avoid conflicts
  // SUPABASE_URL, 
  // SUPABASE_ANON_KEY, 
  // CACHE_CONFIG
} from '@/supabase/client';

// If we still need these constants, re-export with different names
export { SUPABASE_URL as SUPABASE_BASE_URL } from '@/supabase/client';
export { SUPABASE_ANON_KEY as SUPABASE_API_KEY } from '@/supabase/client';
export { CACHE_CONFIG as CACHE_SETTINGS } from '@/supabase/client';
