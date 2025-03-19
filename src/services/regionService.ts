
import { RegionWithStats, CreateRegionDto, UpdateRegionDto } from '@/services/supabase/region/types';
import { supabase } from '@/lib/supabase';

export const getRegions = async () => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .select('*')
      .order('name');

    if (error) throw error;

    // Map the results to ensure the expected shape
    const regionsWithStats = data.map(region => ({
      ...region,
      // Add the calculated fields with default values
      sectorCount: 0,
      schoolCount: 0,
      studentCount: 0,
      teacherCount: 0,
      completionRate: 0,
      description: region.description || '',
      // Backward compatibility
      sectors_count: 0,
      schools_count: 0,
      completion_rate: 0
    }));

    return regionsWithStats;
  } catch (error) {
    console.error('Error fetching regions:', error);
    throw error;
  }
};

export const getRegionById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    // Ensure all required fields exist
    const regionWithStats: RegionWithStats = {
      ...data,
      sectorCount: 0,
      schoolCount: 0,
      studentCount: 0,
      teacherCount: 0,
      completionRate: 0,
      description: data.description || '',
      // Backward compatibility
      sectors_count: 0,
      schools_count: 0,
      completion_rate: 0
    };

    return regionWithStats;
  } catch (error) {
    console.error(`Error fetching region with id ${id}:`, error);
    throw error;
  }
};

export const createRegion = async (regionData: CreateRegionDto) => {
  try {
    // Ensure description is not undefined
    const dataToInsert = {
      ...regionData,
      description: regionData.description || ''
    };

    const { data, error } = await supabase
      .from('regions')
      .insert(dataToInsert)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error creating region:', error);
    throw error;
  }
};

export const updateRegion = async (id: string, regionData: UpdateRegionDto) => {
  try {
    // Ensure description is not undefined if it's being updated
    const dataToUpdate = {
      ...regionData,
      description: regionData.description !== undefined ? regionData.description : ''
    };

    const { data, error } = await supabase
      .from('regions')
      .update(dataToUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error(`Error updating region with id ${id}:`, error);
    throw error;
  }
};

export const deleteRegion = async (id: string) => {
  try {
    const { error } = await supabase
      .from('regions')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error(`Error deleting region with id ${id}:`, error);
    throw error;
  }
};

export const getRegionSectors = async (regionId: string) => {
  try {
    const { data, error } = await supabase
      .from('sectors')
      .select('*')
      .eq('region_id', regionId)
      .order('name');

    if (error) throw error;

    return data.map(sector => ({
      ...sector,
      // Ensure description is not undefined
      description: sector.description || ''
    }));
  } catch (error) {
    console.error(`Error fetching sectors for region ${regionId}:`, error);
    throw error;
  }
};
