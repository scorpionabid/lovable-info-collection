
/**
 * Ana export fayl
 * Bütün servislər, hook-lar və müştəri buradan ixrac olunur
 */

// Supabase müştərisi və konfiqurasiyası
export { supabase, withRetry, queryWithCache, checkConnection, handleSupabaseError } from './client';
export { default as supabaseClient } from './client';
export * from './config';

// Type definitions
export * from './types';

// Services
export * from './services/auth';
export * from './services/regions';
export * from './services/sectors';
export * from './services/schools';
export * from './services/users';
export * from './services/categories';
export * from './services/data';
export * from './services/notifications';

// Hooks
export * from './hooks/useAuth';
export * from './hooks/useRegions';
export * from './hooks/useSectors';
export * from './hooks/useSchools';
export * from './hooks/useUsers';
export * from './hooks/useCategories';
export * from './hooks/useData';
export * from './hooks/useQuerySupabase';
export * from './hooks/useMutateSupabase';

// Explicitly re-export types to avoid ambiguity
export type { LoginCredentials } from './types';
export type { Region, Sector, School, User } from './types';
export type { FilterParams, SortParams, PaginationParams } from './types';
