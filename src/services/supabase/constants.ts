
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
  AUDIT_LOGS = 'audit_logs'
}

/**
 * Sorğu nəticəsini tipləşdirmək üçün köməkçi
 */
export type QueryResult<T> = {
  data: T | null;
  error: any;
};
