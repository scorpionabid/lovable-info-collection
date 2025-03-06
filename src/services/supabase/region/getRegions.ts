
import { supabase, Region } from '../supabaseClient';
import { RegionWithStats, PaginationParams, SortParams, FilterParams } from './types';

// Get regions with optional pagination, sorting and filtering
export const getRegions = async (
  pagination?: PaginationParams,
  sort?: SortParams,
  filters?: FilterParams
) => {
  try {
    let query = supabase
      .from('regions')
      .select('*', { count: 'exact' });

    // Apply search filter
    if (filters?.searchQuery) {
      query = query.or(`name.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`);
    }

    // Apply date filters
    if (filters?.dateFrom) {
      query = query.gte('created_at', filters.dateFrom);
    }
    if (filters?.dateTo) {
      query = query.lte('created_at', filters.dateTo);
    }

    // Apply sorting
    if (sort) {
      query = query.order(sort.column, { ascending: sort.direction === 'asc' });
    } else {
      query = query.order('name', { ascending: true });
    }

    // Apply pagination if provided
    if (pagination) {
      const { page, pageSize } = pagination;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
    }

    const { data, error, count } = await query;
    
    if (error) throw error;

    // Get region statistics from view
    const { data: statsData, error: statsError } = await supabase
      .from('region_statistics')
      .select('region_id, sector_count, school_count, completion_rate');

    if (statsError) throw statsError;

    // Map statistics to regions
    const regionsWithStats: RegionWithStats[] = data.map(region => {
      const stats = statsData.find(s => s.region_id === region.id) || { 
        sector_count: 0, 
        school_count: 0, 
        completion_rate: 0 
      };
      
      return {
        ...region,
        sectorCount: stats.sector_count,
        schoolCount: stats.school_count,
        completionRate: Math.round(stats.completion_rate)
      };
    });

    return { 
      data: regionsWithStats, 
      count: count || 0 
    };
  } catch (error) {
    console.error('Error fetching regions:', error);
    throw error;
  }
};

// Get region by ID with statistics
export const getRegionById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;

    // Get statistics for this region
    const { data: statsData, error: statsError } = await supabase
      .from('region_statistics')
      .select('sector_count, school_count, completion_rate')
      .eq('region_id', id)
      .single();

    if (statsError && statsError.code !== 'PGRST116') { // Ignore "no rows returned" error
      throw statsError;
    }

    // Get region admins
    const { data: adminsData, error: adminsError } = await supabase
      .from('users')
      .select('id, first_name, last_name, email')
      .eq('region_id', id);

    if (adminsError) throw adminsError;

    const regionWithStats: RegionWithStats = {
      ...data,
      sectorCount: statsData?.sector_count || 0,
      schoolCount: statsData?.school_count || 0,
      completionRate: Math.round(statsData?.completion_rate || 0),
      userCount: adminsData.length
    };

    return regionWithStats;
  } catch (error) {
    console.error('Error fetching region:', error);
    throw error;
  }
};
