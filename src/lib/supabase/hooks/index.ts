
// Əsas hook'ları export edirik
export { default as useAuth } from './auth/useAuth';
export { default as useUserProfile } from './auth/useUserProfile';
export { default as useUserData } from './auth/useUserData';
export type { UserProfile } from './auth/useUserProfile';
export type { UserRoleType } from './auth/useUserData';

// Digər hook'ları export edirik
export { default as useRegions } from './useRegions';
export { default as useSectors } from './useSectors';
export { default as useSchools } from './useSchools';
export { default as useCategories } from './useCategories';
export { default as useData } from './useData';
export { default as useNotifications } from './useNotifications';
export { default as useSchoolTypes } from './useSchoolTypes';

// Query və mutation hook'ları export edirik
export { default as useQuerySupabase } from './useQuerySupabase';
export { default as useMutateSupabase } from './useMutateSupabase';
export { default as useSupabaseQuery } from './useSupabaseQuery';

// Ümumi custom hooklar
export { default as useSupabaseStorage } from './useSupabaseStorage';
export { default as useAuditLog } from './useAuditLog';
