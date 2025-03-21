
import { supabase, handleSupabaseError } from '../client';
import { 
  Region, 
  RegionWithStats, 
  CreateRegionDto, 
  UpdateRegionDto, 
  FilterParams, 
  SortParams 
} from '../types';
import { TABLES } from '../config';

/**
 * Get all regions with optional filtering and sorting
 */
export const getRegions = async (
  filters: FilterParams = {}, 
  sort: SortParams = { field: 'name', direction: 'asc' }
): Promise<RegionWithStats[]> => {
  try {
    let query = supabase
      .from(TABLES.REGIONS)
      .select(`
        *,
        sectors:${TABLES.SECTORS}(id),
        schools:${TABLES.SCHOOLS}(id)
      `);

    // Apply filters
    if (filters.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }

    // Apply sorting
    if (sort.field) {
      query = query.order(sort.field, { ascending: sort.direction === 'asc' });
    } else {
      query = query.order('name', { ascending: true });
    }

    const { data, error } = await query;

    if (error) throw handleSupabaseError(error, 'Get regions');

    // Transform the data to include stats
    const regionsWithStats: RegionWithStats[] = (data || []).map(region => ({
      id: region.id,
      name: region.name,
      code: region.code || '',
      description: region.description || '',
      created_at: region.created_at,
      updated_at: region.updated_at,
      sectors_count: region.sectors ? region.sectors.length : 0,
      schools_count: region.schools ? region.schools.length : 0,
      // Computed fields
      sectorCount: region.sectors ? region.sectors.length : 0,
      schoolCount: region.schools ? region.schools.length : 0,
      completionRate: calculateCompletionRate(region)
    }));

    return regionsWithStats;
  } catch (error) {
    console.error('Error fetching regions:', error);
    throw error;
  }
};

/**
 * Helper function to calculate completion rate
 */
const calculateCompletionRate = (region: any): number => {
  // This is a placeholder. Implement your actual calculation logic.
  return Math.floor(Math.random() * 100);
};

/**
 * Get region by ID
 */
export const getRegionById = async (id: string): Promise<RegionWithStats> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.REGIONS)
      .select(`
        *,
        sectors:${TABLES.SECTORS}(id, name),
        schools:${TABLES.SCHOOLS}(id, name)
      `)
      .eq('id', id)
      .single();

    if (error) throw handleSupabaseError(error, 'Get region by ID');

    // Calculate statistics
    const sectorCount = data.sectors ? data.sectors.length : 0;
    const schoolCount = data.schools ? data.schools.length : 0;

    return {
      id: data.id,
      name: data.name,
      code: data.code || '',
      description: data.description || '',
      created_at: data.created_at,
      updated_at: data.updated_at,
      sectors_count: sectorCount,
      schools_count: schoolCount,
      sectorCount,
      schoolCount,
      completionRate: calculateCompletionRate(data)
    };
  } catch (error) {
    console.error(`Error fetching region with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Search regions
 */
export const searchRegions = async (searchTerm: string): Promise<Region[]> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.REGIONS)
      .select('*')
      .ilike('name', `%${searchTerm}%`)
      .order('name');

    if (error) throw handleSupabaseError(error, 'Search regions');

    return (data || []).map(region => ({
      ...region,
      description: region.description || ''
    }));
  } catch (error) {
    console.error('Error searching regions:', error);
    throw error;
  }
};

/**
 * Create a new region
 */
export const createRegion = async (regionData: CreateRegionDto): Promise<Region> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.REGIONS)
      .insert([{ 
        name: regionData.name,
        code: regionData.code || null,
        description: regionData.description || '',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw handleSupabaseError(error, 'Create region');

    return data as Region;
  } catch (error) {
    console.error('Error creating region:', error);
    throw error;
  }
};

/**
 * Update an existing region
 */
export const updateRegion = async (id: string, regionData: UpdateRegionDto): Promise<Region> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.REGIONS)
      .update({ 
        name: regionData.name,
        code: regionData.code,
        description: regionData.description || '',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw handleSupabaseError(error, 'Update region');

    return data as Region;
  } catch (error) {
    console.error(`Error updating region with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a region
 */
export const deleteRegion = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(TABLES.REGIONS)
      .delete()
      .eq('id', id);

    if (error) throw handleSupabaseError(error, 'Delete region');

    return true;
  } catch (error) {
    console.error(`Error deleting region with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Get sectors by region ID
 */
export const getSectorsByRegion = async (regionId: string) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.SECTORS)
      .select('id, name, description')
      .eq('region_id', regionId)
      .order('name');

    if (error) throw handleSupabaseError(error, 'Get sectors by region');

    return data.map(sector => ({
      ...sector,
      description: sector.description || ''
    }));
  } catch (error) {
    console.error(`Error fetching sectors for region ${regionId}:`, error);
    throw error;
  }
};

/**
 * Archive a region (soft delete)
 */
export const archiveRegion = async (id: string): Promise<boolean> => {
  try {
    // First check if this region has any active sectors or schools
    const { data: sectors, error: sectorsError } = await supabase
      .from(TABLES.SECTORS)
      .select('id')
      .eq('region_id', id)
      .eq('archived', false);
      
    if (sectorsError) throw handleSupabaseError(sectorsError, 'Check sectors before archive');
    
    if (sectors && sectors.length > 0) {
      throw new Error('Cannot archive region with active sectors. Please archive all sectors first.');
    }
    
    // Then perform the archive
    const { error } = await supabase
      .from(TABLES.REGIONS)
      .update({ archived: true, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw handleSupabaseError(error, 'Archive region');

    return true;
  } catch (error) {
    console.error(`Error archiving region with ID ${id}:`, error);
    throw error;
  }
};
