
/**
 * Xidmət ixracları
 */

// Supabase xidmətləri
export { default as authService } from './authService';
export { default as dataService } from './dataService';
export { default as categoryService } from './categoryService';
export { default as userService } from './userService';
export * as regionService from './regionService'; // Changed from regionService to export all named exports
export { default as notificationService } from './notificationService';
export { default as auditLogService } from './auditLogService';
export { default as metricService } from './metricService';
export { default as exportService } from './exportService';
export { default as reportService } from './reportService';
export { default as approvalService } from './approvalService';

// Supabase müştərisi
export { supabase } from '@/lib/supabase';
export { checkConnection } from '@/lib/supabase';
