
/**
 * Utility functions for working with Supabase types
 */
import { Database } from '@/types/supabase';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Helper type for checking table names in the type-safe way
export type TableNames = keyof Database['public']['Tables'];

// Helper to ensure table name is valid at compile time
export function isValidTable<T extends string>(
  tableName: T
): T extends TableNames ? true : false {
  // This function doesn't do anything at runtime, it's just for type checking
  return true as any;
}

// Type-safe wrapper around from() to ensure table names are valid
export function safeFrom<T extends TableNames>(
  client: SupabaseClient<Database>,
  table: T
) {
  return client.from(table);
}

// Strongly typed table helper - ensure this is type-safe and includes all tables
export const TABLES = {
  USERS: 'users' as const,
  REGIONS: 'regions' as const,
  SECTORS: 'sectors' as const,
  SCHOOLS: 'schools' as const,
  CATEGORIES: 'categories' as const,
  COLUMNS: 'columns' as const,
  DATA: 'data' as const,
  DATA_HISTORY: 'data_history' as const,
  AUDIT_LOGS: 'audit_logs' as const,
  API_METRICS: 'api_metrics' as const, 
  NOTIFICATIONS: 'notifications' as const,
  ROLES: 'roles' as const,
  SCHOOL_TYPES: 'school_types' as const
} as const;

// Type guard for table names
export function validateTableName(table: string): table is TableNames {
  return Object.values(TABLES).includes(table as any);
}
