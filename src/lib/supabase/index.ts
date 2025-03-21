/**
 * Mərkəzi export nöqtəsi bütün Supabase əlaqəli funksionallıq üçün
 */

// Klient və konfiqurasiya
export { supabase, handleSupabaseError, withRetry } from './client';
export { 
  SUPABASE_URL, 
  SUPABASE_ANON_KEY,
  SUPABASE_CONFIG,
  CACHE_CONFIG,
  TABLES,
  isDevelopment
} from './config';

// Auth servisi
export {
  loginUser,
  logoutUser,
  getCurrentUser,
  resetPassword,
  updatePassword,
  refreshSession,
  getSession,
  hasRole,
  sendConfirmationEmail,
  sendPasswordResetEmail
} from './services/auth';

// Region servisi
export {
  getRegions,
  getRegionById,
  createRegion,
  updateRegion,
  deleteRegion,
  getSectorsByRegion
} from './services/regions';

// Sektor servisi
export {
  getSectors,
  getSectorById,
  createSector,
  updateSector,
  deleteSector,
  getSectorsByRegionId
} from './services/sectors';

// Məktəb servisi
export {
  getSchools,
  getSchoolById,
  createSchool,
  updateSchool,
  deleteSchool,
  getSchoolsByRegionId,
  getSchoolsBySectorId,
  getSchoolTypes
} from './services/schools';

// İstifadəçi servisi
export {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  blockUser,
  activateUser,
  resetPassword as resetUserPassword,
  getRoles,
  getRegions as getUserRegions,
  getSectors as getUserSectors,
  getSchools as getUserSchools
} from './services/users';

// Kateqoriya servisi
export {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryColumns
} from './services/categories';

// Data servisi
export {
  getData,
  getDataById,
  createData,
  updateData,
  deleteData
} from './services/data';

// Bildiriş servisi
export {
  getNotifications,
  markNotificationRead, 
  markAllNotificationsRead,
  sendNotification
} from './services/notifications';

// Hook-lar
export { useAuth } from './hooks/useAuth';
export { useRegions } from './hooks/useRegions';
export { useSectors } from './hooks/useSectors';
export { useSchools } from './hooks/useSchools';
export { useSchoolTypes } from './hooks/useSchoolTypes';
export { useUsers } from './hooks/useUsers';
export { useCategories } from './hooks/useCategories';
export { useData } from './hooks/useData';
export { useQuerySupabase } from './hooks/useQuerySupabase';
export { useMutateSupabase } from './hooks/useMutateSupabase';

// Tipler
export * from './types/user';
export * from './types/region';
export * from './types/sector';
export * from './types/school';
export * from './types/category';
export * from './types/data';
export * from './types/notification';
export * from './services/approvals';
export * from './services/audit';
export * from './services/exports';
export * from './services/metrics';
