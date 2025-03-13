
import { supabase } from '@/integrations/supabase/client';

// Utility function to safely execute a query with error handling
export const safeQuery = async (fn: () => Promise<any>) => {
  try {
    return await fn();
  } catch (error) {
    console.error('API query error:', error);
    return { data: null, error };
  }
};

// Helper to determine if an argument is an ID or a config object
export const isId = (arg: any): arg is string => {
  return typeof arg === 'string';
};

// Helper to extract table name from first argument
export const getTableName = (tableNameOrConfig: any): string => {
  if (typeof tableNameOrConfig === 'string') {
    return tableNameOrConfig;
  }
  if (tableNameOrConfig && tableNameOrConfig.tableName) {
    return tableNameOrConfig.tableName;
  }
  throw new Error('Invalid table name argument');
};
