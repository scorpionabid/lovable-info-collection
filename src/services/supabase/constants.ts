
/**
 * Supabase cədvəl adları və sabitlər
 */

// Cədvəl adları enum
export enum TableName {
  API_METRICS = 'api_metrics',
  AUDIT_LOGS = 'audit_logs',
  CATEGORIES = 'categories',
  COLUMNS = 'columns',
  DATA = 'data',
  DATA_HISTORY = 'data_history',
  NOTIFICATIONS = 'notifications',
  REGIONS = 'regions',
  ROLES = 'roles',
  SCHOOLS = 'schools',
  SECTORS = 'sectors',
  USERS = 'users',
  SCHOOL_TYPES = 'school_types',
  SETTINGS = 'settings',
  CACHE_ENTRIES = 'cache_entries'
}

// Status sabitləri
export enum StatusConstants {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
  PENDING = 'pending'
}

// Rol sabitləri
export enum RoleConstants {
  SUPER_ADMIN = 'super-admin',
  REGION_ADMIN = 'region-admin',
  SECTOR_ADMIN = 'sector-admin',
  SCHOOL_ADMIN = 'school-admin'
}

// Bildiriş tipləri
export enum NotificationType {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success',
  DEADLINE = 'deadline',
  APPROVAL = 'approval',
  REJECTION = 'rejection',
  SYSTEM = 'system'
}

// Kateqoriya təyinatları
export enum CategoryAssignment {
  ALL = 'All',
  REGIONS = 'Regions',
  SECTORS = 'Sectors',
  SCHOOLS = 'Schools'
}

// Sorğu limitləri
export enum QueryLimits {
  DEFAULT_PAGE_SIZE = 10,
  MAX_PAGE_SIZE = 100,
  MAX_ITEMS_PER_BATCH = 1000
}

// Default konfiqurasiya sabitləri
export const DEFAULT_CONFIG = {
  defaultLanguage: 'az',
  defaultPageSize: 10,
  defaultCacheDuration: 300000, // 5 dəqiqə (millisaniyələrlə)
  maxItemsPerBatch: 1000,
  tokenExpiryBuffer: 300000, // 5 dəqiqə (millisaniyələrlə)
  sessionTimeout: 3600000 // 1 saat (millisaniyələrlə)
};
