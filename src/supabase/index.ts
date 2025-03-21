
/**
 * Ana export fayl
 * Bütün servislər, hook-lar və müştəri buradan ixrac olunur
 */

// Supabase müştərisi və konfiqurasiyonu
export { supabase, withRetry, isOfflineMode, queryWithCache, clearCache } from './client';
export { default as supabaseClient } from './client';
export * from './config';
export * from './types';

// Servisləri ixrac et
export * from './services/regions';
export * from './services/sectors';
export * from './services/schools';
export * from './services/users';
export * from './services/auth';

// React hook-larını ixrac et
export * from './hooks/useAuth';
export * from './hooks/useRegions';
export * from './hooks/useSectors';
export * from './hooks/useSchools';
export * from './hooks/useUsers';
