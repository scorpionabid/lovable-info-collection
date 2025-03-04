
import { supabase, Region } from './supabaseClient';
import { useToast } from '@/hooks/use-toast';

// Extended Region type to include statistics
export interface RegionWithStats extends Region {
  sectorCount: number;
  schoolCount: number;
  completionRate: number;
}

// Pagination parameters
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// Sort parameters
export interface SortParams {
  column: string;
  direction: 'asc' | 'desc';
}

// Filter parameters
export interface FilterParams {
  searchQuery?: string;
  dateFrom?: string;
  dateTo?: string;
  completionRate?: 'all' | 'high' | 'medium' | 'low';
}

const regionService = {
  // Get regions with optional pagination, sorting and filtering
  getRegions: async (
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
  },
  
  // Get region by ID with statistics
  getRegionById: async (id: string) => {
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

      const regionWithStats: RegionWithStats & { users?: number } = {
        ...data,
        sectorCount: statsData?.sector_count || 0,
        schoolCount: statsData?.school_count || 0,
        completionRate: Math.round(statsData?.completion_rate || 0),
        users: adminsData.length
      };

      return regionWithStats;
    } catch (error) {
      console.error('Error fetching region:', error);
      throw error;
    }
  },
  
  // Get sectors by region ID
  getRegionSectors: async (regionId: string) => {
    try {
      const { data, error } = await supabase
        .from('sectors')
        .select('*')
        .eq('region_id', regionId);
      
      if (error) throw error;

      // Get school counts for each sector
      const sectorIds = data.map(sector => sector.id);
      const { data: schoolCounts, error: schoolError } = await supabase
        .from('schools')
        .select('sector_id, count')
        .in('sector_id', sectorIds)
        .group('sector_id');

      if (schoolError && schoolError.code !== 'PGRST116') { // Ignore "no rows returned" error
        throw schoolError;
      }
      
      // Map school counts to sectors and add mock completion rates for now
      const sectorsWithStats = data.map(sector => {
        const schoolCountRecord = schoolCounts.find(s => s.sector_id === sector.id);
        // Generate a random completion rate between 60 and 95% for demo purposes
        const completionRate = Math.floor(Math.random() * 35) + 60;
        
        return {
          ...sector,
          schoolCount: schoolCountRecord?.count || 0,
          completionRate
        };
      });

      return sectorsWithStats;
    } catch (error) {
      console.error('Error fetching region sectors:', error);
      throw error;
    }
  },
  
  // Create a new region
  createRegion: async (region: Omit<Region, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('regions')
        .insert([region])
        .select()
        .single();
      
      if (error) throw error;
      return data as Region;
    } catch (error) {
      console.error('Error creating region:', error);
      throw error;
    }
  },
  
  // Update an existing region
  updateRegion: async (id: string, region: Partial<Omit<Region, 'id' | 'created_at'>>) => {
    try {
      const { data, error } = await supabase
        .from('regions')
        .update(region)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Region;
    } catch (error) {
      console.error('Error updating region:', error);
      throw error;
    }
  },
  
  // Delete a region
  deleteRegion: async (id: string) => {
    try {
      const { error } = await supabase
        .from('regions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting region:', error);
      throw error;
    }
  },
  
  // Archive a region (soft delete)
  archiveRegion: async (id: string) => {
    try {
      // This is just a placeholder implementation since we don't have an 'is_archived' field
      // In a real application, you might add this field or implement proper archiving
      const { data, error } = await supabase
        .from('regions')
        .update({ archived: true })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Region;
    } catch (error) {
      console.error('Error archiving region:', error);
      throw error;
    }
  }
};

export default regionService;
