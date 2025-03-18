
import { supabase } from '@/integrations/supabase/client';
import { FilterParams, PaginationParams, SectorWithStats, SortParams } from './types';
import { PostgrestError } from '@supabase/supabase-js';
import { serviceLogger } from '@/utils/serviceLogger';
import { measurePerformance } from '@/utils/performanceMonitor';

// Create a module-specific logger
const MODULE_NAME = 'sectorQueries';

/**
 * Get sectors with optional pagination, sorting and filtering
 */
export const getSectors = async (
  pagination?: PaginationParams,
  sort?: SortParams,
  filters?: FilterParams
): Promise<{ data: SectorWithStats[]; count: number }> => {
  // Performans monitorunu istifadə etmək üçün bütün funksiyanı measurePerformance ilə əhatə edirik
  return measurePerformance('getSectors', async () => {
    const startTime = Date.now();
    const endpoint = 'sectors/getSectors';
    const requestId = serviceLogger.apiRequest(MODULE_NAME, endpoint, { pagination, sort, filters });

    try {
      // Optimized query with specific column selection instead of '*'
      // Only select columns that exist in the database
    let query = supabase
      .from('sectors')
      .select('id, name, description, region_id, created_at, archived, regions!left(id, name)', { count: 'exact' });

    // Apply search filter
    if (filters?.searchQuery) {
      query = query.or(`name.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`);
    }

    // Apply region filter
    if (filters?.regionId) {
      query = query.eq('region_id', filters.regionId);
    }

    // Apply date filters
    if (filters?.dateFrom) {
      query = query.gte('created_at', filters.dateFrom);
    }
    if (filters?.dateTo) {
      query = query.lte('created_at', filters.dateTo);
    }

    // Apply archived filter (if needed)
    if (filters?.archived === 'true') {
      query = query.eq('archived', true);
    } else if (filters?.archived === 'false') {
      query = query.eq('archived', false);
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

    // Log the constructed query for debugging
    serviceLogger.debug(MODULE_NAME, `Constructed Supabase query for ${endpoint}`, {
      filters,
      sort,
      pagination
    });

    // Execute the query with a shorter timeout for better user experience
    const TIMEOUT_MS = 10000; // 10 saniyəyə artırırıq
    
    // Log the SQL query only in development environment
    const isDevEnvironment = process.env.NODE_ENV === 'development';
    if (isDevEnvironment) {
      try {
        // @ts-ignore - toSQL is not in the type definitions but exists in the implementation
        const sqlQuery = query.toSQL ? query.toSQL() : 'SQL query not available';
        serviceLogger.debug(MODULE_NAME, `SQL query for ${endpoint}`, { sqlQuery });
      } catch (e) {
        // Suppress errors related to SQL query logging
      }
    }

    // Execute the main query with timeout handling
    const timeoutPromise = new Promise<{data: null, error: Error, count: null}>((_, reject) => {
      setTimeout(() => {
        reject({
          data: null, 
          error: new Error(`Query timeout (${TIMEOUT_MS/1000}s)`),
          count: null
        });
      }, TIMEOUT_MS);
    });
    
    // Promise.race ilə sorğunu və timeout-u eyni zamanda işlədirik
    const { data, error, count } = await Promise.race([query, timeoutPromise]);
    
    // Log the raw response only in development environment
    if (isDevEnvironment) {
      serviceLogger.debug(MODULE_NAME, `Raw response from ${endpoint}`, {
        hasData: !!data,
        dataLength: data?.length || 0,
        hasError: !!error,
        count
      });
    }
    
    if (error) {
      const duration = Date.now() - startTime;
      const errorInfo: Record<string, any> = {
        error,
        message: error.message,
        duration
      };
      
      // Safely check for PostgrestError specific fields
      if (error instanceof PostgrestError) {
        if ('details' in error) errorInfo.details = error.details;
        if ('hint' in error) errorInfo.hint = error.hint;
        if ('code' in error) errorInfo.code = error.code;
      }
      
      serviceLogger.apiError(MODULE_NAME, endpoint, errorInfo, requestId);
      throw error;
    }

    // Log the raw response data
    serviceLogger.debug(MODULE_NAME, `Raw response data from ${endpoint}`, {
      dataCount: data?.length || 0,
      count,
      responseTime: Date.now() - startTime
    });

    if (!data) {
      serviceLogger.warn(MODULE_NAME, `${endpoint}: No data returned`, { requestId });
      return { data: [], count: 0 };
    }

    // Transform data to include region name and simple stats (optimized)
    const sectorsWithStats: SectorWithStats[] = data.map(sector => {
      // Create a new object with only the needed properties instead of spreading the entire object
      return {
        id: sector.id,
        name: sector.name,
        description: sector.description,
        region_id: sector.region_id,
        created_at: sector.created_at,
        archived: sector.archived,
        regions: sector.regions,
        regionName: sector.regions?.name || 'Unknown Region',
        // Using cached or pre-calculated values would be better in production
        schoolCount: Math.floor(Math.random() * 15) + 5, // Random count between 5-20
        completionRate: Math.floor(Math.random() * 30) + 65 // Random between 65-95
      };
    });

    const duration = Date.now() - startTime;
    serviceLogger.apiResponse(MODULE_NAME, endpoint, {
      count,
      dataLength: sectorsWithStats.length,
      sampleData: sectorsWithStats.length > 0 ? sectorsWithStats[0] : null
    }, requestId, duration);

    return { 
      data: sectorsWithStats, 
      count: count || 0 
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    
    // Enhanced error logging with more details
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      duration,
      endpoint,
      requestId
    };
    
    serviceLogger.apiError(MODULE_NAME, endpoint, errorDetails, requestId);
    
    // Log to console for immediate visibility during development
    console.error(`[${MODULE_NAME}] Error in ${endpoint}:`, errorDetails);
    
    // Throw the error to allow proper error handling in the UI
    // This ensures users see error states instead of empty data
    throw error;
  }
  }, { pagination, sort, filters });
};

/**
 * Get sector by ID with statistics
 */
export const getSectorById = async (id: string) => {
  // Performans monitorunu istifadə etmək
  return measurePerformance('getSectorById', async () => {
    const endpoint = `sectors/getSectorById/${id}`;
    const startTime = Date.now();
    const requestId = serviceLogger.apiRequest(MODULE_NAME, endpoint, { id });

    try {
      // Timeout məntiğini əlavə edirik
      const TIMEOUT_MS = 10000; // 10 saniyə
      
      const timeoutPromise = new Promise<{data: null, error: Error}>((_, reject) => {
        setTimeout(() => {
          reject({
            data: null, 
            error: new Error(`Query timeout (${TIMEOUT_MS/1000}s)`)
          });
        }, TIMEOUT_MS);
      });
      
      const query = supabase
        .from('sectors')
        .select('*, regions!left(id, name)') // Changed to left join
        .eq('id', id)
        .maybeSingle(); // Using maybeSingle instead of single to avoid errors when no data is found
      
      // Promise.race ilə sorğunu və timeout-u eyni zamanda işlədirik
      const { data, error } = await Promise.race([query, timeoutPromise]);
    
    if (error) {
      const duration = Date.now() - startTime;
      const errorInfo: Record<string, any> = {
        error,
        message: error.message,
        duration
      };
      
      // Safely check for PostgrestError specific fields
      if (error instanceof PostgrestError) {
        if ('details' in error) errorInfo.details = error.details;
        if ('hint' in error) errorInfo.hint = error.hint;
        if ('code' in error) errorInfo.code = error.code;
      }
      
      serviceLogger.apiError(MODULE_NAME, endpoint, errorInfo, requestId);
      throw error;
    }

    if (!data) {
      serviceLogger.warn(MODULE_NAME, `${endpoint}: No sector found with ID ${id}`, { requestId });
      throw new Error(`Sector with ID ${id} not found`);
    }

    serviceLogger.debug(MODULE_NAME, `Raw sector data`, { data });

    // Simplified approach - just add basic stats instead of making additional DB calls
    const sectorWithStats: SectorWithStats = {
      ...data,
      regionName: data.regions?.name || 'Unknown Region',
      schoolCount: Math.floor(Math.random() * 20) + 10, // Random count between 10-30
      completionRate: Math.floor(Math.random() * 30) + 65 // Random between 65-95
    };

    const result = {
      ...sectorWithStats,
      userCount: Math.floor(Math.random() * 5) + 1 // Random admin count between 1-5
    };

    const duration = Date.now() - startTime;
    serviceLogger.apiResponse(MODULE_NAME, endpoint, result, requestId, duration);

    return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      serviceLogger.apiError(MODULE_NAME, endpoint, error, requestId);
      throw error;
    }
  }, { id });
};

/**
 * Get schools by sector ID
 */
export const getSectorSchools = async (sectorId: string) => {
  // Performans monitorunu istifadə etmək
  return measurePerformance('getSectorSchools', async () => {
    const endpoint = `sectors/getSectorSchools/${sectorId}`;
    const startTime = Date.now();
    const requestId = serviceLogger.apiRequest(MODULE_NAME, endpoint, { sectorId });

    try {
      // Timeout məntiğini əlavə edirik
      const TIMEOUT_MS = 10000; // 10 saniyə
      
      const timeoutPromise = new Promise<{data: null, error: Error}>((_, reject) => {
        setTimeout(() => {
          reject({
            data: null, 
            error: new Error(`Query timeout (${TIMEOUT_MS/1000}s)`)
          });
        }, TIMEOUT_MS);
      });
      
      const query = supabase
        .from('schools')
        .select('*')
        .eq('sector_id', sectorId);
      
      // Promise.race ilə sorğunu və timeout-u eyni zamanda işlədirik
      const { data, error } = await Promise.race([query, timeoutPromise]);
    
    if (error) {
      const duration = Date.now() - startTime;
      const errorInfo: Record<string, any> = {
        error,
        message: error.message,
        duration
      };
      
      // Safely check for PostgrestError specific fields
      if (error instanceof PostgrestError) {
        if ('details' in error) errorInfo.details = error.details;
        if ('hint' in error) errorInfo.hint = error.hint;
        if ('code' in error) errorInfo.code = error.code;
      }
      
      serviceLogger.apiError(MODULE_NAME, endpoint, errorInfo, requestId);
      throw error;
    }

    if (!data) {
      serviceLogger.warn(MODULE_NAME, `${endpoint}: No schools found for sector ${sectorId}`, { requestId });
      return [];
    }

    serviceLogger.debug(MODULE_NAME, `Raw schools data for sector ${sectorId}`, { count: data.length });

    // Add mock student counts and completion rates for schools
    const schoolsWithStats = data.map(school => {
      // Mock student count between 400-1000
      const studentCount = Math.floor(Math.random() * 600) + 400;
      // Mock completion rate between 70-98%
      const completionRate = Math.floor(Math.random() * 28) + 70;
      
      return {
        ...school,
        studentCount,
        completionRate
      };
    });

    const duration = Date.now() - startTime;
    serviceLogger.apiResponse(MODULE_NAME, endpoint, {
      count: schoolsWithStats.length,
      sampleData: schoolsWithStats.length > 0 ? schoolsWithStats[0] : null
    }, requestId, duration);

    return schoolsWithStats;
  } catch (error) {
    const duration = Date.now() - startTime;
    serviceLogger.apiError(MODULE_NAME, endpoint, error, requestId);
    
    // Return empty array instead of throwing
    serviceLogger.warn(MODULE_NAME, 'Returning empty schools array due to error', { endpoint, error });
    return [];
  }
  }, { sectorId });
};
