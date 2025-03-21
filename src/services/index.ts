
/**
 * Servislər üçün index faylı
 * Köhnə API-dan yeni API-ya keçid üçün adapter
 */

// Supabase ilə bağlı bütün servislər
export * from '@/supabase/services/regions';
export * from '@/supabase/services/sectors';
export * from '@/supabase/services/schools';
export * from '@/supabase/services/users';
export * from '@/supabase/services/auth';

// Hook və müştəri exportları
export * from '@/supabase/client';
export * from '@/supabase/config';

// Region servisi
import regionService from './regionService';
export { regionService };

// Sector servisi
import sectorService from './sectorService';
export { sectorService };

// School servisi
import schoolService from './schoolService';
export { schoolService };

// User servisi
import userService from './userService';
export { userService };

// Auth servisi
import authService from './authService';
export { authService };
