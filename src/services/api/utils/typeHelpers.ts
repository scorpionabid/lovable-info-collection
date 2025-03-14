
/**
 * Helper types and utilities to mitigate TypeScript excessive type instantiation errors
 * when working with Supabase queries.
 */

import { supabase } from '@/integrations/supabase/client';
import { KnownTable } from './tableOperations';

/**
 * A simplified type for database query results
 */
export interface QueryResult<T = any> {
  data: T | null;
  error: any | null;
  count?: number;
}

/**
 * A simplified type for Supabase query builders
 * This helps avoid excessive type instantiation by providing a simpler interface
 */
export interface SimplifiedQueryBuilder {
  select: (columns?: string) => SimplifiedQueryBuilder;
  insert: (data: any) => SimplifiedQueryBuilder;
  update: (data: any) => SimplifiedQueryBuilder;
  delete: () => SimplifiedQueryBuilder;
  eq: (column: string, value: any) => SimplifiedQueryBuilder;
  neq: (column: string, value: any) => SimplifiedQueryBuilder;
  gt: (column: string, value: any) => SimplifiedQueryBuilder;
  lt: (column: string, value: any) => SimplifiedQueryBuilder;
  gte: (column: string, value: any) => SimplifiedQueryBuilder;
  lte: (column: string, value: any) => SimplifiedQueryBuilder;
  like: (column: string, pattern: string) => SimplifiedQueryBuilder;
  ilike: (column: string, pattern: string) => SimplifiedQueryBuilder;
  is: (column: string, value: any) => SimplifiedQueryBuilder;
  in: (column: string, values: any[]) => SimplifiedQueryBuilder;
  contains: (column: string, value: any) => SimplifiedQueryBuilder;
  containedBy: (column: string, value: any) => SimplifiedQueryBuilder;
  filter: (column: string, operator: string, value: any) => SimplifiedQueryBuilder;
  not: (column: string, operator: string, value: any) => SimplifiedQueryBuilder;
  or: (filters: string, options?: { foreignTable?: string }) => SimplifiedQueryBuilder;
  and: (filters: string, options?: { foreignTable?: string }) => SimplifiedQueryBuilder;
  order: (column: string, options?: { ascending?: boolean; nullsFirst?: boolean; foreignTable?: string }) => SimplifiedQueryBuilder;
  limit: (count: number) => SimplifiedQueryBuilder;
  range: (from: number, to: number) => SimplifiedQueryBuilder;
  single: () => Promise<QueryResult>;
  maybeSingle: () => Promise<QueryResult>;
  then: (onfulfilled?: ((value: QueryResult) => any) | undefined) => Promise<any>;
}

/**
 * Safely convert any Supabase query to a simplified query builder type
 * This helps avoid TypeScript's excessive type instantiation errors
 */
export function simplifyQueryBuilder(query: any): SimplifiedQueryBuilder {
  return query as SimplifiedQueryBuilder;
}

/**
 * Get a simplified query builder for a table
 * Using as any to bypass TypeScript's strict table name checking
 */
export function getSimplifiedTableQuery(tableName: KnownTable | string): SimplifiedQueryBuilder {
  // Use type assertion to bypass TypeScript's strict table name checking
  return simplifyQueryBuilder((supabase.from as any)(tableName));
}
