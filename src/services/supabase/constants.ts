
// Constants for Supabase table names
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
  SCHOOL_TYPES = 'school_types'
}

// Generic error handling wrapper for Supabase queries
export const handleSupabaseResult = async <T>(
  queryPromise: Promise<{ data: T | null; error: any }>
): Promise<{ data: T | null; error: any }> => {
  try {
    const { data, error } = await queryPromise;
    return { data, error };
  } catch (caughtError) {
    console.error('Supabase query error:', caughtError);
    return { data: null, error: caughtError };
  }
};
