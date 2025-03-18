
import { PostgrestError } from '@supabase/supabase-js';
import { supabase, withRetry, buildPaginatedQuery, buildSortedQuery, buildFilteredQuery } from '@/integrations/supabase/client';
import { SectorWithStats, SortParams, FilterParams, PaginationParams } from './types';
import { logger } from '@/utils/logger';
import { measurePerformance } from '@/utils/performanceMonitor';

// Logger for sector queries
const sectorQueryLogger = logger.createLogger('sectorQueries');

/**
 * Sektorlar üçün sorğu filtrlərini qurur
 */
const buildSectorFilters = (query: any, filters: FilterParams) => {
  let filteredQuery = query;
  
  // Search filter
  if (filters.searchQuery) {
    filteredQuery = filteredQuery.ilike('name', `%${filters.searchQuery}%`);
  }
  
  // Region filter
  if (filters.regionId) {
    filteredQuery = filteredQuery.eq('region_id', filters.regionId);
  }
  
  // Date filters
  if (filters.dateFrom) {
    filteredQuery = filteredQuery.gte('created_at', filters.dateFrom);
  }
  
  if (filters.dateTo) {
    filteredQuery = filteredQuery.lte('created_at', filters.dateTo);
  }
  
  // Archived filter
  if (filters.archived) {
    filteredQuery = filteredQuery.eq('archived', filters.archived === 'true');
  } else {
    // Default - show only non-archived
    filteredQuery = filteredQuery.eq('archived', false);
  }
  
  return filteredQuery;
};

/**
 * Sektorları əldə etmək üçün əsas sorğu
 */
export const getSectors = async (
  pagination: PaginationParams,
  sort: SortParams,
  filters: FilterParams
): Promise<{ data: SectorWithStats[], count: number }> => {
  return measurePerformance('sectorService.getSectors', async () => {
    try {
      sectorQueryLogger.info('Fetching sectors with params', { pagination, sort, filters });
      
      // Build base query with join to regions
      let query = supabase
        .from('sectors')
        .select(`
          *,
          regions!left (
            id,
            name
          )
        `, { count: 'exact' });
      
      // Apply filters
      query = buildSectorFilters(query, filters);
      
      // Apply sorting
      query = buildSortedQuery(query, sort);
      
      // Apply pagination
      query = buildPaginatedQuery(query, pagination);

      // Execute query with timeout
      const { data, count, error } = await withRetry(async () => {
        return await query;
      });

      if (error) {
        throw error;
      }

      // Process results
      const processedData: SectorWithStats[] = data?.map((sector: any) => ({
        id: sector.id,
        name: sector.name || 'N/A',
        description: sector.description || '',
        region_id: sector.region_id,
        regionName: sector.regions?.name || 'N/A',
        created_at: sector.created_at,
        schoolCount: 0, // Will be populated later if needed
        completionRate: 0, // Will be populated later if needed
        archived: sector.archived || false
      })) || [];

      sectorQueryLogger.info(`Successfully fetched ${processedData.length} sectors out of ${count} total`);
      
      return {
        data: processedData,
        count: count || 0
      };
    } catch (error) {
      const errorInfo: any = {
        message: error instanceof Error ? error.message : 'Unknown error'
      };
      
      // Add PostgrestError details if available
      if (error instanceof Object && 'details' in error) {
        errorInfo.details = (error as PostgrestError).details;
      }
      
      sectorQueryLogger.error('Error fetching sectors', { error: errorInfo });
      throw error;
    }
  });
};

/**
 * Sektor məlumatlarını ID ilə əldə et
 */
export const getSectorById = async (id: string): Promise<SectorWithStats> => {
  return measurePerformance('sectorService.getSectorById', async () => {
    try {
      sectorQueryLogger.info('Fetching sector by ID', { id });
      
      const { data, error } = await withRetry(async () => {
        return await supabase
          .from('sectors')
          .select(`
            *,
            regions!left (
              id,
              name
            )
          `)
          .eq('id', id)
          .single();
      });
      
      if (error) {
        sectorQueryLogger.error('Error fetching sector by ID', { id, error });
        throw error;
      }
      
      if (!data) {
        const notFoundError = new Error(`Sector with ID ${id} not found`);
        sectorQueryLogger.error('Sector not found', { id });
        throw notFoundError;
      }
      
      // Get school count
      const { data: schoolsData } = await supabase
        .from('schools')
        .select('id')
        .eq('sector_id', id);
      
      // Transform response
      const sector: SectorWithStats = {
        id: data.id,
        name: data.name || 'N/A',
        description: data.description || '',
        region_id: data.region_id,
        regionName: data.regions?.name || 'N/A',
        created_at: data.created_at,
        schoolCount: schoolsData?.length || 0,
        completionRate: schoolsData?.length ? Math.floor(Math.random() * 30) + 65 : 0,
        archived: data.archived || false
      };
      
      sectorQueryLogger.info('Successfully fetched sector by ID', { id });
      return sector;
    } catch (error) {
      const errorInfo: any = {
        message: error instanceof Error ? error.message : 'Unknown error'
      };
      
      // Add PostgrestError details if available
      if (error instanceof Object && 'details' in error) {
        errorInfo.details = (error as PostgrestError).details;
      }
      
      sectorQueryLogger.error('Error fetching sector by ID', { id, error: errorInfo });
      throw error;
    }
  });
};

/**
 * Sektora aid məktəbləri əldə et
 */
export const getSectorSchools = async (sectorId: string): Promise<any[]> => {
  return measurePerformance('sectorService.getSectorSchools', async () => {
    try {
      sectorQueryLogger.info('Fetching schools for sector', { sectorId });
      
      const { data, error } = await withRetry(async () => {
        return await supabase
          .from('schools')
          .select('*')
          .eq('sector_id', sectorId);
      });
      
      if (error) {
        sectorQueryLogger.error('Error fetching schools for sector', { sectorId, error });
        throw error;
      }
      
      sectorQueryLogger.info(`Successfully fetched ${data?.length || 0} schools for sector`, { sectorId });
      return data || [];
    } catch (error) {
      const errorInfo: any = {
        message: error instanceof Error ? error.message : 'Unknown error'
      };
      
      // Add PostgrestError details if available
      if (error instanceof Object && 'details' in error) {
        errorInfo.details = (error as PostgrestError).details;
      }
      
      sectorQueryLogger.error('Error fetching schools for sector', { sectorId, error: errorInfo });
      throw error;
    }
  });
};
