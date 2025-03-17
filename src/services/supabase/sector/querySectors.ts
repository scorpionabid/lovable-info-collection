
import { supabase } from './baseClient';
import { FilterParams, PaginationParams, SectorWithStats, SortParams } from './types';
import { useLogger } from '@/hooks/useLogger';

// Create a logger for this service
const logger = {
  ...useLogger('sectorService'),
  // Bəzi browser-only funksiyalar SSR kontekstində işləmir, bu səbəbdən boş funksiyalar əlavə edirik
  apiRequest: (endpoint: string, params?: any) => {
    try {
      console.info(`[API] Request to ${endpoint}`, { params });
    } catch (e) {
      // İstisnaları udur
    }
  },
  apiResponse: (endpoint: string, response: any, duration?: number) => {
    try {
      console.info(`[API] Response from ${endpoint} in ${duration || '?'}ms`, {
        status: 'success',
        dataSnapshot: typeof response === 'object' 
          ? JSON.stringify(response).substring(0, 200) + '...'
          : response
      });
    } catch (e) {
      // İstisnaları udur
    }
  },
  apiError: (endpoint: string, error: any) => {
    try {
      console.error(`[API] Error from ${endpoint}`, error);
    } catch (e) {
      // İstisnaları udur
    }
  }
};

/**
 * Get sectors with optional pagination, sorting and filtering
 */
export const getSectors = async (
  pagination?: PaginationParams,
  sort?: SortParams,
  filters?: FilterParams
): Promise<{ data: SectorWithStats[]; count: number }> => {
  const startTime = Date.now();
  const endpoint = 'sectors/getSectors';
  logger.apiRequest(endpoint, { pagination, sort, filters });

  try {
    let query = supabase
      .from('sectors')
      .select('*, regions!inner(id, name)', { count: 'exact' });

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
    
    if (error) {
      const duration = Date.now() - startTime;
      logger.apiError(endpoint, {
        error,
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        duration
      });
      throw error;
    }

    if (!data) {
      logger.warn(`${endpoint}: No data returned`);
      return { data: [], count: 0 };
    }

    // Transform data to include region name
    const sectorsWithStats: SectorWithStats[] = await Promise.all(
      data.map(async (sector) => {
        try {
          // Get school count for this sector
          const { data: schoolsData, error: schoolsError } = await supabase
            .from('schools')
            .select('id')
            .eq('sector_id', sector.id);

          if (schoolsError) {
            logger.error(`Error fetching schools for sector ${sector.id}`, schoolsError);
            throw schoolsError;
          }

          // Calculate mock completion rate based on school count for now
          const schoolCount = schoolsData?.length || 0;
          const completionRate = schoolCount > 0 
            ? Math.floor(Math.random() * 30) + 65 // Random between 65-95 for demo
            : 0;

          const transformedSector: SectorWithStats = {
            ...sector,
            regionName: sector.regions?.name || 'Unknown Region',
            schoolCount,
            completionRate
          };
          
          return transformedSector;
        } catch (error) {
          logger.error(`Error processing sector ${sector.id}`, error);
          // Return partial data on error rather than failing completely
          return {
            ...sector,
            regionName: sector.regions?.name || 'Unknown Region',
            schoolCount: 0,
            completionRate: 0
          };
        }
      })
    );

    const duration = Date.now() - startTime;
    logger.apiResponse(endpoint, {
      count,
      dataLength: sectorsWithStats.length,
      sampleData: sectorsWithStats.length > 0 ? sectorsWithStats[0] : null
    }, duration);

    return { 
      data: sectorsWithStats, 
      count: count || 0 
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.apiError(endpoint, error);
    
    // Return safe empty result instead of throwing to improve UI resilience
    return { data: [], count: 0 };
  }
};

/**
 * Get sector by ID with statistics
 */
export const getSectorById = async (id: string) => {
  const endpoint = `sectors/getSectorById/${id}`;
  const startTime = Date.now();
  logger.apiRequest(endpoint, { id });

  try {
    const { data, error } = await supabase
      .from('sectors')
      .select('*, regions!inner(id, name)')
      .eq('id', id)
      .maybeSingle(); // Using maybeSingle instead of single to avoid errors when no data is found
    
    if (error) {
      const duration = Date.now() - startTime;
      logger.apiError(endpoint, {
        error,
        message: error.message,
        details: error.details,
        code: error.code,
        duration
      });
      throw error;
    }

    if (!data) {
      logger.warn(`${endpoint}: No sector found with ID ${id}`);
      throw new Error(`Sector with ID ${id} not found`);
    }

    // Get school count for this sector
    const { data: schoolsData, error: schoolsError } = await supabase
      .from('schools')
      .select('id')
      .eq('sector_id', id);

    if (schoolsError) {
      logger.error(`Error fetching schools for sector ${id}`, schoolsError);
      throw schoolsError;
    }

    // Get admins for this sector
    const { data: adminsData, error: adminsError } = await supabase
      .from('users')
      .select('id, first_name, last_name, email')
      .eq('sector_id', id);

    if (adminsError) {
      logger.error(`Error fetching admins for sector ${id}`, adminsError);
      throw adminsError;
    }

    // Calculate mock completion rate based on school count for now
    const schoolCount = schoolsData?.length || 0;
    const completionRate = schoolCount > 0 
      ? Math.floor(Math.random() * 30) + 65 // Random between 65-95 for demo
      : 0;

    const sectorWithStats: SectorWithStats = {
      ...data,
      regionName: data.regions?.name || 'Unknown Region',
      schoolCount,
      completionRate
    };

    const result = {
      ...sectorWithStats,
      userCount: adminsData?.length || 0
    };

    const duration = Date.now() - startTime;
    logger.apiResponse(endpoint, result, duration);

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.apiError(endpoint, error);
    throw error;
  }
};

/**
 * Get schools by sector ID
 */
export const getSectorSchools = async (sectorId: string) => {
  const endpoint = `sectors/getSectorSchools/${sectorId}`;
  const startTime = Date.now();
  logger.apiRequest(endpoint, { sectorId });

  try {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('sector_id', sectorId);
    
    if (error) {
      const duration = Date.now() - startTime;
      logger.apiError(endpoint, {
        error,
        message: error.message,
        details: error.details,
        code: error.code,
        duration
      });
      throw error;
    }

    if (!data) {
      logger.warn(`${endpoint}: No schools found for sector ${sectorId}`);
      return [];
    }

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
    logger.apiResponse(endpoint, {
      count: schoolsWithStats.length,
      sampleData: schoolsWithStats.length > 0 ? schoolsWithStats[0] : null
    }, duration);

    return schoolsWithStats;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.apiError(endpoint, error);
    throw error;
  }
};
