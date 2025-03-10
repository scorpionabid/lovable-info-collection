
import { supabase } from '../client';
import { RegionWithStats, PaginationParams, SortParams, FilterParams } from './types';
import { logApiCall } from '../client/logger';

/**
 * Fetches regions with pagination, sorting and filtering
 * @param pagination Pagination parameters
 * @param sort Sorting parameters
 * @param filters Filtering parameters
 * @returns Paginated list of regions with statistics
 */
export const getRegions = async (
  pagination: PaginationParams,
  sort: SortParams,
  filters: FilterParams
): Promise<{ data: RegionWithStats[], count: number }> => {
  return logApiCall('getRegions', async () => {
    try {
      // Extract pagination, sorting and filtering parameters
      const { page, pageSize } = pagination;
      const { column, direction } = sort;
      const { searchQuery, dateFrom, dateTo, completionRate } = filters;
      
      // Calculate offset for pagination
      const offset = (page - 1) * pageSize;
      
      // Start query builder
      let query = supabase
        .from('regions')
        .select(`
          *,
          sectors:sectors(count),
          schools:schools(count)
        `, { count: 'exact' });
      
      // Apply filters if provided
      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }
      
      if (dateFrom) {
        query = query.gte('created_at', dateFrom);
      }
      
      if (dateTo) {
        // Add 1 day to include the end date fully
        const endDate = new Date(dateTo);
        endDate.setDate(endDate.getDate() + 1);
        query = query.lt('created_at', endDate.toISOString());
      }
      
      // Apply sorting
      query = query.order(column, { ascending: direction === 'asc' });
      
      // Apply pagination
      query = query.range(offset, offset + pageSize - 1);
      
      // Execute query
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      if (!data) return { data: [], count: 0 };
      
      // Transform data to include statistics
      const regionsWithStats: RegionWithStats[] = data.map(region => {
        const sectorCount = region.sectors?.[0]?.count || 0;
        const schoolCount = region.schools?.[0]?.count || 0;
        
        // Calculate completion rate (mock data for now)
        // In a real app, this would come from another query or calculation
        const completionRate = Math.floor(Math.random() * 100);
        
        return {
          ...region,
          sectorCount,
          schoolCount,
          completionRate
        };
      });
      
      // Filter by completion rate if specified
      let filteredRegions = regionsWithStats;
      if (completionRate && completionRate !== 'all') {
        filteredRegions = regionsWithStats.filter(region => {
          if (completionRate === 'high') return region.completionRate > 80;
          if (completionRate === 'medium') return region.completionRate >= 50 && region.completionRate <= 80;
          if (completionRate === 'low') return region.completionRate < 50;
          return true;
        });
      }
      
      return { 
        data: filteredRegions,
        count: count || 0
      };
    } catch (error) {
      console.error('Error fetching regions:', error);
      throw error;
    }
  });
};

/**
 * Fetches a single region by ID with statistics
 * @param id Region ID
 * @returns Region with statistics
 */
export const getRegionById = async (id: string): Promise<RegionWithStats> => {
  return logApiCall(`getRegionById:${id}`, async () => {
    try {
      const { data, error } = await supabase
        .from('regions')
        .select(`
          *,
          sectors:sectors(count),
          schools:schools(count)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (!data) throw new Error('Region not found');
      
      // Get sector and school counts
      const sectorCount = data.sectors?.[0]?.count || 0;
      const schoolCount = data.schools?.[0]?.count || 0;
      
      // Calculate completion rate (mock data for now)
      const completionRate = Math.floor(Math.random() * 100);
      
      // Return region with stats
      return {
        ...data,
        sectorCount,
        schoolCount,
        completionRate
      };
    } catch (error) {
      console.error('Error fetching region by ID:', error);
      throw error;
    }
  });
};

/**
 * Searches regions by name
 * @param searchTerm Search term to find in region names
 * @returns List of matching regions
 */
export const searchRegionsByName = async (searchTerm: string): Promise<RegionWithStats[]> => {
  return logApiCall(`searchRegionsByName:${searchTerm}`, async () => {
    try {
      if (!searchTerm.trim()) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('regions')
        .select(`
          *,
          sectors:sectors(count),
          schools:schools(count)
        `)
        .ilike('name', `%${searchTerm}%`)
        .limit(10);
      
      if (error) throw error;
      
      if (!data) return [];
      
      // Transform data to include statistics
      const regionsWithStats: RegionWithStats[] = data.map(region => {
        const sectorCount = region.sectors?.[0]?.count || 0;
        const schoolCount = region.schools?.[0]?.count || 0;
        const completionRate = Math.floor(Math.random() * 100);
        
        return {
          ...data,
          sectorCount,
          schoolCount,
          completionRate
        };
      });
      
      return regionsWithStats;
    } catch (error) {
      console.error('Error searching regions by name:', error);
      throw error;
    }
  });
};
