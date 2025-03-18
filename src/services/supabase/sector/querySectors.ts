
import { PostgrestError } from '@supabase/supabase-js';
import { SectorWithStats, SortParams, FilterParams, PaginationParams } from './types';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

const sectorLogger = logger.createLogger('querySectors');

// Maximum amount of time to wait for a query before timing out
const QUERY_TIMEOUT_MS = 10000;

/**
 * Fetch sectors with pagination, sorting and filtering
 * @param pagination Pagination parameters (page, pageSize)
 * @param sort Sorting parameters (column, direction)
 * @param filters Filter parameters
 * @returns Promise with sectors data and count
 */
export const getSectors = async (
  pagination: PaginationParams,
  sort: SortParams,
  filters: FilterParams
): Promise<{ data: SectorWithStats[], count: number }> => {
  try {
    const { page, pageSize } = pagination;
    const { column, direction } = sort;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    sectorLogger.info('Fetching sectors with params', { pagination, sort, filters });
    
    // Build base query
    let query = supabase
      .from('sectors')
      .select(`
        *,
        regions!left (
          id,
          name
        )
      `, { count: 'exact' });
    
    // Apply search filter
    if (filters.searchQuery) {
      query = query.ilike('name', `%${filters.searchQuery}%`);
    }
    
    // Apply region filter
    if (filters.regionId) {
      query = query.eq('region_id', filters.regionId);
    }
    
    // Apply date filters
    if (filters.dateFrom) {
      query = query.gte('created_at', filters.dateFrom);
    }
    
    if (filters.dateTo) {
      query = query.lte('created_at', filters.dateTo);
    }
    
    // Apply sorting
    query = query.order(column, { ascending: direction === 'asc' });
    
    // Apply pagination
    query = query.range(from, to);

    // Execute query with timeout
    const result = await Promise.race([
      query,
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Query timeout (10s)')), QUERY_TIMEOUT_MS);
      })
    ]);

    // Cast result to the actual response type
    const { data, count, error } = result as any;

    if (error) {
      throw error;
    }

    // Handle successful response
    const processedData: SectorWithStats[] = data?.map((sector: any) => {
      // Extract region name from the joined data
      const regionName = sector.regions?.name || 'N/A';
      
      // Create a properly structured sector object
      return {
        id: sector.id,
        name: sector.name || 'N/A',
        description: sector.description || '',
        regionId: sector.region_id,
        regionName: regionName,
        created_at: sector.created_at,
        // Placeholder data since we're not fetching these in the initial query
        schoolCount: 0,
        completionRate: 0,
        archived: sector.archived || false
      };
    }) || [];

    sectorLogger.info(`Successfully fetched ${processedData.length} sectors out of ${count} total`);
    
    return {
      data: processedData,
      count: count || 0
    };
  } catch (error) {
    const errorInfo: any = {
      message: error instanceof Error ? error.message : 'Unknown error'
    };
    
    // Handle Postgrest-specific error details if available
    if (error instanceof Object && 'details' in error) {
      errorInfo.details = (error as PostgrestError).details;
    }
    
    if (error instanceof Object && 'hint' in error) {
      errorInfo.hint = (error as PostgrestError).hint;
    }
    
    if (error instanceof Object && 'code' in error) {
      errorInfo.code = (error as PostgrestError).code;
    }
    
    sectorLogger.error('Error fetching sectors', { error: errorInfo });
    throw error;
  }
};
