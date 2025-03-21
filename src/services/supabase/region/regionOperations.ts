
import { supabase } from '@/lib/supabase';
import { Region, RegionWithStats, CreateRegionDto, UpdateRegionDto } from '@/supabase/types';

// Get region by ID
export const getRegionById = async (id: string): Promise<RegionWithStats | null> => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .select(`
        *,
        sectors:sectors(id),
        schools:schools(id)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

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
      sectorCount,
      schoolCount,
      studentCount: 0, // Placeholder value
      teacherCount: 0, // Placeholder value
      completionRate: 0, // Placeholder value
      sectors_count: sectorCount,
      schools_count: schoolCount
    };
  } catch (error) {
    console.error(`Error fetching region with ID ${id}:`, error);
    throw error;
  }
};

// Create a new region
export const createRegion = async (regionData: CreateRegionDto): Promise<Region> => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .insert([regionData])
      .select()
      .single();

    if (error) throw error;
    return data as Region;
  } catch (error) {
    console.error('Error creating region:', error);
    throw error;
  }
};

// Update an existing region
export const updateRegion = async (id: string, regionData: UpdateRegionDto): Promise<Region> => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .update(regionData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Region;
  } catch (error) {
    console.error(`Error updating region with ID ${id}:`, error);
    throw error;
  }
};

// Delete a region
export const deleteRegion = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('regions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error deleting region with ID ${id}:`, error);
    throw error;
  }
};

// Archive a region (soft delete)
export const archiveRegion = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('regions')
      .update({ archived: true })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error archiving region with ID ${id}:`, error);
    throw error;
  }
};
