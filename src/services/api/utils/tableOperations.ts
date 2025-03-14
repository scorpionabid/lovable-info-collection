
import { supabase } from '@/integrations/supabase/client';

// Define known tables in the application
export type KnownTable = 
  | 'categories' 
  | 'regions' 
  | 'sectors' 
  | 'schools' 
  | 'users' 
  | 'data' 
  | 'columns';

// Get a Supabase query builder for a known table
export const getTableQuery = (tableName: string) => {
  // Start with a hardcoded switch statement for known tables
  switch (tableName) {
    case 'categories':
      return supabase.from('categories');
    case 'regions':
      return supabase.from('regions');
    case 'sectors':
      return supabase.from('sectors');
    case 'schools':
      return supabase.from('schools');
    case 'users':
      return supabase.from('users');
    case 'data':
      return supabase.from('data');
    case 'columns':
      return supabase.from('columns');
    default:
      // For unknown tables, use a type assertion to bypass TypeScript's strict checking
      return (supabase.from as any)(tableName);
  }
};
