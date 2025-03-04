
import { supabase } from './baseClient';
import { FilterParams, PaginationParams, SectorWithStats, SortParams } from './types';

/**
 * Get sectors with optional pagination, sorting and filtering
 */
export const getSectors = async (
  pagination?: PaginationParams,
  sort?: SortParams,
  filters?: FilterParams
) => {
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
    
    if (error) throw error;

    // Transform data to include region name
    const sectorsWithStats: SectorWithStats[] = await Promise.all(
      data.map(async (sector) => {
        // Get school count for this sector
        const { data: schoolsData, error: schoolsError } = await supabase
          .from('schools')
          .select('id')
          .eq('sector_id', sector.id);

        if (schoolsError) throw schoolsError;

        // Calculate mock completion rate based on school count for now
        // In a real scenario, you'd calculate this from actual data
        const schoolCount = schoolsData.length;
        const completionRate = schoolCount > 0 
          ? Math.floor(Math.random() * 30) + 65 // Random between 65-95 for demo
          : 0;

        return {
          ...sector,
          regionName: sector.regions.name,
          schoolCount,
          completionRate
        };
      })
    );

    return { 
      data: sectorsWithStats, 
      count: count || 0 
    };
  } catch (error) {
    console.error('Error fetching sectors:', error);
    throw error;
  }
};

/**
 * Get sector by ID with statistics
 */
export const getSectorById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('sectors')
      .select('*, regions!inner(id, name)')
      .eq('id', id)
      .single();
    
    if (error) throw error;

    // Get school count for this sector
    const { data: schoolsData, error: schoolsError } = await supabase
      .from('schools')
      .select('id')
      .eq('sector_id', id);

    if (schoolsError) throw schoolsError;

    // Get admins for this sector
    const { data: adminsData, error: adminsError } = await supabase
      .from('users')
      .select('id, first_name, last_name, email')
      .eq('sector_id', id);

    if (adminsError) throw adminsError;

    // Calculate mock completion rate based on school count for now
    const schoolCount = schoolsData.length;
    const completionRate = schoolCount > 0 
      ? Math.floor(Math.random() * 30) + 65 // Random between 65-95 for demo
      : 0;

    const sectorWithStats: SectorWithStats = {
      ...data,
      regionName: data.regions.name,
      schoolCount,
      completionRate
    };

    return {
      ...sectorWithStats,
      userCount: adminsData.length
    };
  } catch (error) {
    console.error('Error fetching sector:', error);
    throw error;
  }
};

/**
 * Get schools by sector ID
 */
export const getSectorSchools = async (sectorId: string) => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('sector_id', sectorId);
    
    if (error) throw error;

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

    return schoolsWithStats;
  } catch (error) {
    console.error('Error fetching sector schools:', error);
    throw error;
  }
};
