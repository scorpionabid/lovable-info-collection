
/**
 * Supabase cədvəl adları üçün sabitlər
 */
export enum TableName {
  USERS = 'users',
  ROLES = 'roles',
  REGIONS = 'regions',
  SECTORS = 'sectors',
  SCHOOLS = 'schools',
  CATEGORIES = 'categories',
  COLUMNS = 'columns',
  DATA = 'data',
  DATA_HISTORY = 'data_history',
  NOTIFICATIONS = 'notifications',
  AUDIT_LOGS = 'audit_logs',
  API_METRICS = 'api_metrics',
  PERFORMANCE_METRICS = 'performance_metrics',
  ERROR_LOGS = 'error_logs',
  SCHEMA_DEFINITIONS = 'schema_definitions',
  SCHOOL_TYPES = 'school_types',
  VALIDATION_RULES = 'validation_rules'
}

/**
 * Sorğu nəticəsini tipləşdirmək üçün köməkçi
 */
export type QueryResult<T> = {
  data: T | null;
  error: any;
};

/**
 * Məlumat emalı üçün daimi vəziyyətlər
 */
export enum DataStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

/**
 * Bildiriş tipləri
 */
export enum NotificationType {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success',
  DEADLINE = 'deadline',
  DATA_CHANGE = 'data_change',
  SYSTEM = 'system'
}

/**
 * Rəng sabitləri
 */
export enum AppColors {
  PRIMARY = 'infoline-dark-blue',
  SECONDARY = 'infoline-light-blue',
  NEUTRAL = 'infoline-dark-gray',
  SUCCESS = 'green-500',
  WARNING = 'amber-500',
  ERROR = 'red-500',
  INFO = 'blue-500'
}

/**
 * İstifadəçi rolları
 */
export enum UserRole {
  SUPER_ADMIN = 'super-admin',
  REGION_ADMIN = 'region-admin',
  SECTOR_ADMIN = 'sector-admin',
  SCHOOL_ADMIN = 'school-admin'
}
