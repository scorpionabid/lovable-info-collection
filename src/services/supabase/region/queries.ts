
import { supabase } from '../supabaseClient';
import { Region, RegionWithStats, FilterParams, SortConfig, PaginationParams } from './types';

/**
 * Get all regions with optional filtering, sorting, and pagination
 */
export const getRegions = async (
  pagination?: PaginationParams,
  sortConfig?: SortConfig,
  filters?: FilterParams
): Promise<{ data: Region[]; count: number }> => {
  try {
    let query = supabase.from('regions').select('*', { count: 'exact' });

    // Apply filters
    if (filters) {
      if (filters.name) {
        query = query.ilike('name', `%${filters.name}%`);
      }

      if (filters.code) {
        query = query.ilike('code', `%${filters.code}%`);
      }

      if (filters.status === 'active') {
        query = query.eq('archived', false);
      } else if (filters.status === 'archived') {
        query = query.eq('archived', true);
      }
    }

    // Apply sorting
    if (sortConfig) {
      query = query.order(sortConfig.column, { ascending: sortConfig.direction === 'asc' });
    } else {
      query = query.order('name');
    }

    // Apply pagination
    if (pagination) {
      const from = pagination.page * pagination.pageSize;
      const to = from + pagination.pageSize - 1;
      query = query.range(from, to);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data: data || [],
      count: count || 0
    };
  } catch (error) {
    console.error('Error fetching regions:', error);
    return { data: [], count: 0 };
  }
};

/**
 * Get a region by its ID
 */
export const getRegionById = async (id: string): Promise<Region | null> => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching region with ID ${id}:`, error);
    return null;
  }
};

/**
 * Get region with statistics (sector count, school count, etc.)
 */
export const getRegionWithStats = async (id: string): Promise<RegionWithStats | null> => {
  try {
    // First get the region
    const { data: region, error: regionError } = await supabase
      .from('regions')
      .select('*')
      .eq('id', id)
      .single();

    if (regionError) throw regionError;
    if (!region) return null;

    // Get sector count
    const { count: sectorsCount, error: sectorsError } = await supabase
      .from('sectors')
      .select('*', { count: 'exact' })
      .eq('region_id', id);

    if (sectorsError) throw sectorsError;

    // Get school count
    const { count: schoolsCount, error: schoolsError } = await supabase
      .from('schools')
      .select('*', { count: 'exact' })
      .eq('region_id', id);

    if (schoolsError) throw schoolsError;

    // Create RegionWithStats object
    const regionWithStats: RegionWithStats = {
      ...region,
      sectors_count: sectorsCount || 0,
      schools_count: schoolsCount || 0,
      completion_rate: Math.floor(Math.random() * 100) // Placeholder for actual calculation
    };

    return regionWithStats;
  } catch (error) {
    console.error(`Error fetching region stats for ID ${id}:`, error);
    return null;
  }
};
