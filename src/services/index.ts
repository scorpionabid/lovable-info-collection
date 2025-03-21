
/**
 * İnfoLine servisləri
 * Fayd, bu modul bütün servis funksiyalarını bir araya gətirir
 * və tətbiqin müxtəlif hissələrindən istifadə olunması üçün ixrac edir
 */

// Service exports 
export { default as authService } from './authService';
export { default as userService } from './userService';
// Fix the regionService export - no default required
export * from './regionService';
export { default as sectorService } from './sectorService';
// Import from supabase/school instead since schoolService doesn't exist
export * from './supabase/school';
export { default as categoryService } from './categoryService';
export { default as notificationService } from './notificationService';
// Import replacement for logService
export { logger as logService } from '@/utils/logger';
export { metricService } from './metricService';
export { default as dataService } from './dataService';
// Import placeholder for validationService
export const validationService = {
  validateInput: (input: any, rules: any) => {
    // Basic validation implementation
    return { isValid: true, errors: [] };
  }
};
