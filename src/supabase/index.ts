
/**
 * Ana export fayl
 * Bütün servislər, hook-lar və müştəri buradan ixrac olunur
 */

// Supabase müştərisi və konfiqurasyonu
export { default as supabase } from './client';
export * from './client';
export * from './config';

// Servisləri ixrac et
export * from './services/regions';
export * from './services/sectors';
export * from './services/schools';
export * from './services/users';
export * from './services/auth';

// Hook-ları ixrac et
export * from './hooks/useRegions';
export * from './hooks/useSectors';
export * from './hooks/useSchools';
export * from './hooks/useUsers';
export * from './hooks/useAuth';

// Utility funksiyalar
export * from './utils/cache';
