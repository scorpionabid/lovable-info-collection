
import { supabase } from '@/supabase/client';
import { Region, RegionWithStats, RegionFilters, CreateRegionDto, UpdateRegionDto } from '@/supabase/types';
import { handleSupabaseError } from '@/supabase/client';

// Get all regions
export const getRegions = async (filters: RegionFilters = {}): Promise<{ data: RegionWithStats[], count: number }> => {
  try {
    let query = supabase
      .from('regions')
      .select(`
        *,
        sectors (count),
        schools (count)
      `, { count: 'exact' });

    // Apply filters
    if (filters.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }

    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status === 'active' ? true : false);
    }

    // Apply pagination
    if (filters.page && filters.page_size) {
      const from = (filters.page - 1) * filters.page_size;
      const to = from + filters.page_size - 1;
      query = query.range(from, to);
    }

    const { data, error, count } = await query.order('name', { ascending: true });

    if (error) throw handleSupabaseError(error, 'Get regions');

    // Process data to add derived properties
    const processedData = data?.map(region => {
      const sectorCount = region.sectors?.length || 0;
      const schoolCount = region.schools?.length || 0;
      
      return {
        ...region,
        sectorCount,
        schoolCount,
        sectors_count: sectorCount, // For backward compatibility
        schools_count: schoolCount, // For backward compatibility
        completionRate: Math.round(Math.random() * 100), // Placeholder - should be calculated from actual data
        completion_rate: Math.round(Math.random() * 100) // For backward compatibility
      };
    }) || [];

    return { data: processedData, count: count || 0 };
  } catch (error) {
    console.error('Error getting regions:', error);
    throw error;
  }
};

// Get region by ID
export const getRegionById = async (id: string): Promise<RegionWithStats | null> => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .select(`
        *,
        sectors (count),
        schools (count)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      throw handleSupabaseError(error, 'Get region by ID');
    }

    if (!data) return null;

    const sectorCount = data.sectors?.length || 0;
    const schoolCount = data.schools?.length || 0;

    return {
      ...data,
      sectorCount,
      schoolCount,
      sectors_count: sectorCount, // For backward compatibility
      schools_count: schoolCount, // For backward compatibility
      completionRate: Math.round(Math.random() * 100), // Placeholder
      completion_rate: Math.round(Math.random() * 100) // For backward compatibility
    };
  } catch (error) {
    console.error('Error getting region by ID:', error);
    throw error;
  }
};

// Create region
export const createRegion = async (data: CreateRegionDto): Promise<Region> => {
  try {
    const { data: newRegion, error } = await supabase
      .from('regions')
      .insert([{
        name: data.name,
        code: data.code,
        description: data.description
      }])
      .select()
      .single();

    if (error) throw handleSupabaseError(error, 'Create region');

    return newRegion;
  } catch (error) {
    console.error('Error creating region:', error);
    throw error;
  }
};

// Update region
export const updateRegion = async (id: string, data: UpdateRegionDto): Promise<Region> => {
  try {
    const { data: updatedRegion, error } = await supabase
      .from('regions')
      .update({
        name: data.name,
        code: data.code,
        description: data.description
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw handleSupabaseError(error, 'Update region');

    return updatedRegion;
  } catch (error) {
    console.error('Error updating region:', error);
    throw error;
  }
};

// Delete region
export const deleteRegion = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('regions')
      .delete()
      .eq('id', id);

    if (error) throw handleSupabaseError(error, 'Delete region');

    return true;
  } catch (error) {
    console.error('Error deleting region:', error);
    throw error;
  }
};

// Get regions for dropdown
export const getRegionsForDropdown = async (): Promise<{ id: string; name: string }[]> => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .select('id, name')
      .order('name');

    if (error) throw handleSupabaseError(error, 'Get regions for dropdown');

    return data || [];
  } catch (error) {
    console.error('Error getting regions for dropdown:', error);
    throw error;
  }
};

// Export types
export type { Region, RegionWithStats, RegionFilters, CreateRegionDto, UpdateRegionDto };

// Create a default export with all functions
const regionService = {
  getRegions,
  getRegionById,
  createRegion,
  updateRegion,
  deleteRegion,
  getRegionsForDropdown
};

export default regionService;
