
import { supabase } from "../client";
import { 
  Region, 
  RegionWithStats,
  CreateRegionDto,
  UpdateRegionDto,
  FilterParams,
  PaginationParams
} from "../types";

// Helper function to handle errors
const handleSupabaseError = (error: any, context: string = 'Regions'): Error => {
  const message = error?.message || error?.error_description || 'Unknown error';
  console.error(`${context} error:`, error);
  return new Error(message);
};

// Get all regions with stats
export const getRegions = async (
  filters: FilterParams = {}, 
  sort: { field: string; direction: 'asc' | 'desc' } = { field: 'name', direction: 'asc' }
) => {
  try {
    let query = supabase
      .from('regions')
      .select(`
        *,
        sectors:sectors(id),
        schools:schools(id)
      `);

    // Apply filters
    if (filters.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }

    // Apply sorting
    if (sort.field && sort.direction) {
      query = query.order(sort.field, { ascending: sort.direction === 'asc' });
    }

    const { data, error } = await query;

    if (error) throw handleSupabaseError(error, 'Get regions');

    // Transform the data to include stats
    const regionsWithStats: RegionWithStats[] = data.map(region => ({
      id: region.id,
      name: region.name,
      code: region.code,
      description: region.description,
      created_at: region.created_at,
      updated_at: region.updated_at,
      sectors_count: region.sectors ? region.sectors.length : 0,
      schools_count: region.schools ? region.schools.length : 0,
      completion_rate: calculateCompletionRate(region)
    }));

    return regionsWithStats;
  } catch (error) {
    throw handleSupabaseError(error, 'Get regions');
  }
};

// Helper function to calculate completion rate
const calculateCompletionRate = (region: any): number => {
  // This is a placeholder. Implement your actual calculation logic.
  return Math.floor(Math.random() * 100);
};

// Get region by ID
export const getRegionById = async (id: string): Promise<RegionWithStats> => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .select(`
        *,
        sectors:sectors(id, name),
        schools:schools(id, name)
      `)
      .eq('id', id)
      .single();

    if (error) throw handleSupabaseError(error, 'Get region by ID');

    return {
      id: data.id,
      name: data.name,
      code: data.code,
      description: data.description,
      created_at: data.created_at,
      updated_at: data.updated_at,
      sectors_count: data.sectors ? data.sectors.length : 0,
      schools_count: data.schools ? data.schools.length : 0,
      completion_rate: calculateCompletionRate(data)
    };
  } catch (error) {
    throw handleSupabaseError(error, 'Get region by ID');
  }
};

// Create a new region
export const createRegion = async (regionData: CreateRegionDto) => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .insert([{ 
        name: regionData.name,
        code: regionData.code,
        description: regionData.description,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw handleSupabaseError(error, 'Create region');

    return data as Region;
  } catch (error) {
    throw handleSupabaseError(error, 'Create region');
  }
};

// Update an existing region
export const updateRegion = async (id: string, regionData: UpdateRegionDto) => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .update({ 
        name: regionData.name,
        code: regionData.code,
        description: regionData.description,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw handleSupabaseError(error, 'Update region');

    return data as Region;
  } catch (error) {
    throw handleSupabaseError(error, 'Update region');
  }
};

// Delete a region
export const deleteRegion = async (id: string) => {
  try {
    const { error } = await supabase
      .from('regions')
      .delete()
      .eq('id', id);

    if (error) throw handleSupabaseError(error, 'Delete region');

    return true;
  } catch (error) {
    throw handleSupabaseError(error, 'Delete region');
  }
};

// Get regions for dropdown
export const getRegionsForDropdown = async () => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .select('id, name')
      .order('name');

    if (error) throw handleSupabaseError(error, 'Get regions for dropdown');

    return data;
  } catch (error) {
    throw handleSupabaseError(error, 'Get regions for dropdown');
  }
};
