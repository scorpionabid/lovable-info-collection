
import { Database } from '@/types/supabase';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Helper type for accessing table types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Table names for autocomplete and type checking
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
};
