
import { supabase } from '../supabaseClient';
import { Region, FilterParams, PaginationParams, SortConfig } from './types';

/**
 * Get regions with pagination, sorting and filtering
 * @param pagination Pagination parameters
 * @param sortConfig Sorting configuration
 * @param filters Filter parameters
 * @returns Regions and total count
 */
export const getRegions = async (
  pagination?: PaginationParams,
  sortConfig?: SortConfig,
  filters?: FilterParams
) => {
  try {
    let query = supabase.from('regions').select('*', { count: 'exact' });

    // Apply filters
    if (filters) {
      if (filters.searchQuery) {
        query = query.ilike('name', `%${filters.searchQuery}%`);
      }
      
      if (filters.name) {
        query = query.ilike('name', `%${filters.name}%`);
      }
      
      if (filters.code) {
        query = query.ilike('code', `%${filters.code}%`);
      }
      
      if (filters.status) {
        if (filters.status === 'active') {
          query = query.eq('archived', false);
        } else if (filters.status === 'archived') {
          query = query.eq('archived', true);
        }
      }
      
      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }
      
      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }
    }

    // Apply sorting
    if (sortConfig) {
      query = query.order(sortConfig.field, { ascending: sortConfig.direction === 'asc' });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    if (pagination) {
      const { page, pageSize } = pagination;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data: data as Region[],
      count: count || 0
    };
  } catch (error) {
    console.error('Error fetching regions:', error);
    throw error;
  }
};

/**
 * Get a region by ID
 * @param id Region ID
 * @returns The region or null if not found
 */
export const getRegionById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Region;
  } catch (error) {
    console.error(`Error fetching region with ID ${id}:`, error);
    return null;
  }
};
