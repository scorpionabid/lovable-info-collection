
import { PostgrestError } from '@supabase/supabase-js';
import { 
  supabase, 
  withRetry, 
  buildPaginatedQuery, 
  buildSortedQuery, 
  buildFilteredQuery,
  queryWithCache,
  isOfflineMode,
  checkConnection
} from '@/integrations/supabase/client';
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
  } else if (filters.search) {
    filteredQuery = filteredQuery.ilike('name', `%${filters.search}%`);
  }
  
  // Region filter
  if (filters.region_id) {
    filteredQuery = filteredQuery.eq('region_id', filters.region_id);
  } else if (filters.regionId) {
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
  if (filters.archived !== undefined) {
    if (typeof filters.archived === 'string') {
      filteredQuery = filteredQuery.eq('archived', filters.archived === 'true');
    } else {
      filteredQuery = filteredQuery.eq('archived', filters.archived);
    }
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
      
      // Əlaqə vəziyyətini yoxla
      const isConnected = await checkConnection();
      if (!isConnected) {
        sectorQueryLogger.warn('Offline rejim: Sektorları keşdən yükləməyə çalışırıq');
      }
      
      // Sorğunu sadələşdiririk - performans üçün
      let query = supabase
        .from('sectors')
        .select(`
          id,
          name,
          region_id,
          description,
          created_at,
          archived,
          regions!left (id, name)
        `, { count: 'exact' });
      
      // Apply all filters
      query = buildSectorFilters(query, filters);
      
      // Sadə sıralama
      query = query.order('name', { ascending: sort.direction === 'asc' });
      
      // Səhifələmə üçün limit
      query = query.limit(Math.min(pagination.pageSize, 50)); // Maksimum 50 nəticə qaytaraq
      
      // Offset əlavə edirik
      if (pagination.page > 1) {
        query = query.range(
          (pagination.page - 1) * pagination.pageSize,
          (pagination.page * pagination.pageSize) - 1
        );
      }
      
      sectorQueryLogger.info('Executing query with the following parameters:', {
        pagination,
        sort,
        filters,
        pageSize: Math.min(pagination.pageSize, 50)
      });
      
      // Performans üçün sorğu başlamazdan əvvəl vaxtı qeyd edirik
      const startTime = Date.now();
      
      // Execute the query
      const { data, error, count } = await query;
      
      // Sorğu müddətini ölçürük
      const queryTime = Date.now() - startTime;
      sectorQueryLogger.info(`Query completed in ${queryTime}ms`);
      
      if (error) {
        // Xəta idarəetməsini təkmilləşdirək
        sectorQueryLogger.error('Error fetching sectors', { 
          error, 
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
        // Xəta olsa da boş nəticə qaytarırıq
        return { data: [], count: 0 };
      }
      
      // Process results
      const processedData: SectorWithStats[] = data?.map((sector: any) => {
        // Tipə uyğun olaraq obyekti yaradırıq
        return {
          id: sector.id,
          name: sector.name || 'N/A',
          description: sector.description || '',
          region_id: sector.region_id,
          regionName: sector.regions?.name || 'N/A',
          created_at: sector.created_at,
          schoolCount: 0,
          completionRate: 0,
          archived: Boolean(sector.archived),
          // Backward compatibility
          schools_count: 0,
          completion_rate: 0
        };
      }) || [];
      
      sectorQueryLogger.info(`Successfully fetched ${processedData.length} sectors out of ${count} total`);
      
      return {
        data: processedData,
        count: count || 0
      };
    } catch (error) {
      const errorInfo: Record<string, unknown> = {
        message: error instanceof Error ? error.message : 'Unknown error'
      };
      
      if (error instanceof Error) {
        errorInfo.stack = error.stack;
      }
      
      if (error instanceof PostgrestError) {
        errorInfo.code = error.code;
        errorInfo.details = error.details;
        errorInfo.hint = error.hint;
      }
      
      sectorQueryLogger.error('Failed to fetch sectors', errorInfo);
      throw error;
    }
  });
};

/**
 * Sektora aid məktəbləri əldə etmək üçün sorğu
 */
export const getSectorSchools = async (sectorId: string): Promise<any[]> => {
  return measurePerformance('sectorService.getSectorSchools', async () => {
    try {
      sectorQueryLogger.info(`Fetching schools for sector ID ${sectorId}`);
      
      // withRetry funksiyasının tipini dəqiqləşdirək
      const { data, error } = await withRetry<{
        data: any[] | null;
        error: PostgrestError | null;
      }>(async () => {
        return await supabase
          .from('schools')
          .select(`
            id,
            name,
            code,
            address,
            created_at,
            updated_at,
            archived
          `)
          .eq('sector_id', sectorId)
          .eq('archived', false)
          .order('name', { ascending: true });
      });
      
      if (error) {
        sectorQueryLogger.error(`Error fetching schools for sector ${sectorId}`, { error });
        return [];
      }
      
      sectorQueryLogger.info(`Successfully fetched ${data?.length || 0} schools for sector ${sectorId}`);
      return data || [];
    } catch (error) {
      sectorQueryLogger.error(`Failed to fetch schools for sector ${sectorId}`, { error });
      return [];
    }
  });
};

/**
 * Sektoru ID ilə əldə etmək üçün sorğu
 */
export const getSectorById = async (id: string): Promise<SectorWithStats> => {
  return measurePerformance('sectorService.getSectorById', async () => {
    try {
      sectorQueryLogger.info(`Fetching sector with ID ${id}`);
      
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
        sectorQueryLogger.error(`Error fetching sector ${id}`, { error });
        throw error;
      }
      
      if (!data) {
        sectorQueryLogger.error(`Sector ${id} not found`);
        throw new Error(`Sector ${id} not found`);
      }
      
      // Extract sector data with stats
      const response: SectorWithStats = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        region_id: data.region_id,
        regionName: data.regions?.name || 'Unknown Region',
        created_at: data.created_at,
        schoolCount: 0,
        completionRate: 0,
        archived: Boolean(data.archived),
        // Backward compatibility
        schools_count: 0,
        completion_rate: 0
      };
      
      sectorQueryLogger.info(`Successfully fetched sector ${id}`);
      return response;
    } catch (error) {
      const errorInfo: Record<string, unknown> = {
        message: error instanceof Error ? error.message : 'Unknown error'
      };
      
      if (error instanceof Error) {
        errorInfo.stack = error.stack;
      }
      
      if (error instanceof PostgrestError) {
        errorInfo.code = error.code;
        errorInfo.details = error.details;
        errorInfo.hint = error.hint;
      }
      
      sectorQueryLogger.error(`Failed to fetch sector ${id}`, errorInfo);
      throw error;
    }
  });
};
