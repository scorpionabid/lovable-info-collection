
// Import React properly
import React from 'react';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { castType } from '@/utils/typeUtils';

// Add typings for the query options
export interface SupabaseQueryOptions {
  queryKey: any[];
  enabled?: boolean;
  select?: string;
  pagination?: { page: number; pageSize: number };
  sort?: { column: string; direction: 'asc' | 'desc' };
  filters?: Record<string, any>;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
  cacheTime?: number;
}

/**
 * Hook for querying Supabase data with React Query
 * @param tableName Supabase table name
 * @param queryFn Function that performs the Supabase query
 * @param options Query options
 * @returns Query result object
 */
export function useSupabaseQuery<T>(
  tableName: string,
  queryFn: (client: typeof supabase, options: any) => Promise<{ data: T, error: any }>,
  options: SupabaseQueryOptions
) {
  return useQuery({
    queryKey: options.queryKey,
    queryFn: async () => {
      try {
        // Pass the options to the query function
        const result = await queryFn(supabase, {
          select: options.select,
          pagination: options.pagination,
          sort: options.sort,
          filters: options.filters
        });
        
        if (result.error) {
          throw result.error;
        }
        
        return castType<T>(result.data);
      } catch (error) {
        console.error(`Error querying ${tableName}:`, error);
        throw error;
      }
    },
    enabled: options.enabled,
    refetchOnWindowFocus: options.refetchOnWindowFocus,
    staleTime: options.staleTime,
    gcTime: options.cacheTime
  });
}
