
import { supabase } from '../supabaseClient';
import { Region, Sector } from './types';

/**
 * Create a new region
 * @param region The region data to create
 * @returns The created region
 */
export const createRegion = async (region: Omit<Region, 'id' | 'created_at'>): Promise<Region> => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .insert({
        name: region.name,
        code: region.code,
        description: region.description
      })
      .select()
      .single();

    if (error) throw error;
    return data as Region;
  } catch (error) {
    console.error('Error creating region:', error);
    throw error;
  }
};

/**
 * Update an existing region
 * @param id The region ID to update
 * @param region The new region data
 * @returns The updated region
 */
export const updateRegion = async (id: string, region: Partial<Region>): Promise<Region> => {
  try {
    // Make a copy of the region object to avoid modifying the original
    const updateData = { ...region };
    
    // Update the region
    const { data, error } = await supabase
      .from('regions')
      .update(updateData)
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

/**
 * Delete a region
 * @param id The region ID to delete
 * @returns True if successful
 */
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

/**
 * Archive a region (soft delete)
 * @param id The region ID to archive
 * @returns The archived region
 */
export const archiveRegion = async (id: string): Promise<Region> => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .update({ archived: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Region;
  } catch (error) {
    console.error(`Error archiving region with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new sector
 * @param sector The sector data to create
 * @returns The created sector
 */
export const createSector = async (sector: Omit<Sector, 'id' | 'created_at'>): Promise<Sector> => {
  try {
    const { data, error } = await supabase
      .from('sectors')
      .insert({
        name: sector.name,
        region_id: sector.region_id,
        code: sector.code,
        description: sector.description
      })
      .select()
      .single();

    if (error) throw error;
    return data as Sector;
  } catch (error) {
    console.error('Error creating sector:', error);
    throw error;
  }
};

/**
 * Update an existing sector
 * @param id The sector ID to update
 * @param sector The new sector data
 * @returns The updated sector
 */
export const updateSector = async (id: string, sector: Partial<Sector>): Promise<Sector> => {
  try {
    // Make a copy of the sector object to avoid modifying the original
    const updateData = { ...sector };
    
    // Update the sector
    const { data, error } = await supabase
      .from('sectors')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Sector;
  } catch (error) {
    console.error(`Error updating sector with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a sector
 * @param id The sector ID to delete
 * @returns True if successful
 */
export const deleteSector = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('sectors')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error deleting sector with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Archive a sector (soft delete)
 * @param id The sector ID to archive
 * @returns The archived sector
 */
export const archiveSector = async (id: string): Promise<Sector> => {
  try {
    const { data, error } = await supabase
      .from('sectors')
      .update({ archived: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Sector;
  } catch (error) {
    console.error(`Error archiving sector with ID ${id}:`, error);
    throw error;
  }
};
